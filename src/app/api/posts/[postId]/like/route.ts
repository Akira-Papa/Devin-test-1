import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";
import { getAuthSession } from "../../../../../lib/auth";
import { ObjectId } from "mongodb";

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
    
    const userId = session.user.id;
    const isLiked = post.likes.some((id: string) => id === userId);
    
    if (isLiked) {
      await db.collection("posts").updateOne(
        { _id: new ObjectId(postId) },
        { $pull: { likes: userId } }
      );
      
      return NextResponse.json({ liked: false });
    } else {
      await db.collection("posts").updateOne(
        { _id: new ObjectId(postId) },
        { $addToSet: { likes: userId } }
      );
      
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("いいね処理エラー:", error);
    return NextResponse.json(
      { error: "いいね処理中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
