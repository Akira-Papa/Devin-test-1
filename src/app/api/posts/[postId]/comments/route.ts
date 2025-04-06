import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";
import { getAuthSession } from "../../../../../lib/auth";
import { ObjectId } from "mongodb";

export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const postId = params.postId;
    
    if (!postId || !ObjectId.isValid(postId)) {
      return NextResponse.json(
        { error: "無効な投稿IDです" },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db();
    
    const post = await db.collection("posts").findOne({
      _id: new ObjectId(postId)
    });
    
    if (!post) {
      return NextResponse.json(
        { error: "投稿が見つかりません" },
        { status: 404 }
      );
    }
    
    const comments = await db.collection("comments")
      .find({ post: new ObjectId(postId) })
      .sort({ createdAt: 1 })
      .toArray();
    
    const commentsWithAuthor = await Promise.all(
      comments.map(async (comment) => {
        if (comment.author.isAI) {
          return comment;
        }
        
        const author = await db.collection("users").findOne(
          { _id: comment.author },
          { projection: { name: 1, username: 1, image: 1 } }
        );
        
        return {
          ...comment,
          author
        };
      })
    );
    
    return NextResponse.json(commentsWithAuthor);
  } catch (error) {
    console.error("コメント取得エラー:", error);
    return NextResponse.json(
      { error: "コメントの取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }
    
    const postId = params.postId;
    
    if (!postId || !ObjectId.isValid(postId)) {
      return NextResponse.json(
        { error: "無効な投稿IDです" },
        { status: 400 }
      );
    }
    
    const { content } = await req.json();
    
    if (!content) {
      return NextResponse.json(
        { error: "コメント内容は必須です" },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db();
    
    const post = await db.collection("posts").findOne({
      _id: new ObjectId(postId)
    });
    
    if (!post) {
      return NextResponse.json(
        { error: "投稿が見つかりません" },
        { status: 404 }
      );
    }
    
    const comment = {
      content,
      author: session.user.id,
      post: new ObjectId(postId),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection("comments").insertOne(comment);
    
    return NextResponse.json(
      { message: "コメントが投稿されました", commentId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("コメント投稿エラー:", error);
    return NextResponse.json(
      { error: "コメントの投稿中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
