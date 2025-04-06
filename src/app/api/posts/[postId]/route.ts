import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { getAuthSession } from "../../../../lib/auth";
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
    
    const author = await db.collection("users").findOne(
      { _id: post.author },
      { projection: { name: 1, username: 1, image: 1 } }
    );
    
    const commentCount = await db.collection("comments").countDocuments({
      post: new ObjectId(postId)
    });
    
    const session = await getAuthSession();
    const isLiked = session?.user
      ? post.likes.some((id: string) => id === session.user.id)
      : false;
    
    const postWithDetails = {
      ...post,
      author,
      commentCount,
      isLiked
    };
    
    return NextResponse.json(postWithDetails);
  } catch (error) {
    console.error("投稿詳細取得エラー:", error);
    return NextResponse.json(
      { error: "投稿詳細の取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    
    const { content, media } = await req.json();
    
    if (!content) {
      return NextResponse.json(
        { error: "投稿内容は必須です" },
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
    
    if (post.author.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "この投稿を編集する権限がありません" },
        { status: 403 }
      );
    }
    
    await db.collection("posts").updateOne(
      { _id: new ObjectId(postId) },
      {
        $set: {
          content,
          media: media || [],
          updatedAt: new Date()
        }
      }
    );
    
    return NextResponse.json({ message: "投稿が更新されました" });
  } catch (error) {
    console.error("投稿更新エラー:", error);
    return NextResponse.json(
      { error: "投稿の更新中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    
    if (post.author.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "この投稿を削除する権限がありません" },
        { status: 403 }
      );
    }
    
    await db.collection("posts").deleteOne({
      _id: new ObjectId(postId)
    });
    
    await db.collection("comments").deleteMany({
      post: new ObjectId(postId)
    });
    
    return NextResponse.json({ message: "投稿が削除されました" });
  } catch (error) {
    console.error("投稿削除エラー:", error);
    return NextResponse.json(
      { error: "投稿の削除中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
