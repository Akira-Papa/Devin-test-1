import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { getAuthSession } from "../../../lib/auth";
import { Anthropic } from "@anthropic-ai/sdk";

const aiCharacters = [
  { name: "高橋博士", field: "科学技術", personality: "論理的で冷静" },
  { name: "佐藤教授", field: "歴史文化", personality: "博識で温厚" },
  { name: "田中アナリスト", field: "経済金融", personality: "鋭い洞察力と批判精神" },
  { name: "鈴木クリエイター", field: "芸術デザイン", personality: "創造的で情熱的" }
];

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const followingOnly = searchParams.get("followingOnly") === "true";
    
    const client = await clientPromise;
    const db = client.db();
    
    let query: any = {};
    
    if (userId) {
      query.author = userId;
    }
    
    if (followingOnly && session?.user) {
      const following = await db.collection("follows").find({
        follower: session.user.id
      }).toArray();
      
      const followingIds = following.map(follow => follow.following);
      query.author = { $in: followingIds };
    }
    
    const posts = await db.collection("posts")
      .find(query)
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();
      
    const postsWithAuthor = await Promise.all(
      posts.map(async (post) => {
        const author = await db.collection("users").findOne(
          { _id: post.author },
          { projection: { name: 1, username: 1, image: 1 } }
        );
        
        const commentCount = await db.collection("comments").countDocuments({
          post: post._id
        });
        
        return {
          ...post,
          author,
          commentCount,
          isLiked: session?.user ? post.likes.includes(session.user.id) : false
        };
      })
    );
    
    return NextResponse.json(postsWithAuthor);
  } catch (error) {
    console.error("投稿取得エラー:", error);
    return NextResponse.json(
      { error: "投稿の取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }
    
    const { content, media } = await req.json();
    
    if (!content) {
      return NextResponse.json(
        { error: "投稿内容は必須です" },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db();
    
    const post = {
      content,
      author: session.user.id,
      media: media || [],
      likes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection("posts").insertOne(post);
    
    await generateAIComments(db, result.insertedId, content);
    
    return NextResponse.json(
      { message: "投稿が作成されました", postId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("投稿作成エラー:", error);
    return NextResponse.json(
      { error: "投稿の作成中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

async function generateAIComments(db: any, postId: any, content: string) {
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    
    const selectedCharacters = aiCharacters
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    
    for (const character of selectedCharacters) {
      const prompt = `
あなたは${character.name}という${character.field}の専門家です。性格は${character.personality}です。
以下の投稿に対して、専門家としての視点からコメントしてください。
コメントは100文字以内で簡潔に、${character.personality}な性格を反映させてください。

投稿内容:
${content}
`;

      const response = await anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 150,
        messages: [
          { role: "user", content: prompt }
        ],
      });
      
      const aiComment = response.content[0]?.type === 'text' 
        ? response.content[0].text 
        : JSON.stringify(response.content[0]);
      
      await db.collection("comments").insertOne({
        content: aiComment,
        author: {
          name: character.name,
          isAI: true,
          aiCharacter: character.field
        },
        post: postId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  } catch (error) {
    console.error("AIコメント生成エラー:", error);
  }
}
