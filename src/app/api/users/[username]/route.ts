import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { getAuthSession } from "../../../../lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username;
    
    if (!username) {
      return NextResponse.json(
        { error: "ユーザー名が指定されていません" },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db();
    
    const user = await db.collection("users").findOne(
      { username },
      { projection: { password: 0 } }
    );
    
    if (!user) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      );
    }
    
    const followersCount = await db.collection("follows").countDocuments({
      following: user._id
    });
    
    const followingCount = await db.collection("follows").countDocuments({
      follower: user._id
    });
    
    const postsCount = await db.collection("posts").countDocuments({
      author: user._id
    });
    
    return NextResponse.json({
      user,
      followersCount,
      followingCount,
      postsCount
    });
  } catch (error) {
    console.error("ユーザー情報取得エラー:", error);
    return NextResponse.json(
      { error: "ユーザー情報の取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { username: string } }
) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }
    
    const username = params.username;
    
    if ((session.user as any).username !== username) {
      return NextResponse.json(
        { error: "このプロフィールを編集する権限がありません" },
        { status: 403 }
      );
    }
    
    const { name, bio } = await req.json();
    
    if (!name) {
      return NextResponse.json(
        { error: "名前は必須です" },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db();
    
    await db.collection("users").updateOne(
      { username },
      {
        $set: {
          name,
          bio: bio || "",
          updatedAt: new Date()
        }
      }
    );
    
    return NextResponse.json({ message: "プロフィールが更新されました" });
  } catch (error) {
    console.error("プロフィール更新エラー:", error);
    return NextResponse.json(
      { error: "プロフィールの更新中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
