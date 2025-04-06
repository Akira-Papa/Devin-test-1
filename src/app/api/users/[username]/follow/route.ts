import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";
import { getAuthSession } from "../../../../../lib/auth";

export async function POST(
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
    
    const targetUsername = params.username;
    
    if (!targetUsername) {
      return NextResponse.json(
        { error: "ユーザー名が指定されていません" },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db();
    
    const targetUser = await db.collection("users").findOne({
      username: targetUsername
    });
    
    if (!targetUser) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      );
    }
    
    if (targetUser._id.toString() === session.user.id) {
      return NextResponse.json(
        { error: "自分自身をフォローすることはできません" },
        { status: 400 }
      );
    }
    
    const existingFollow = await db.collection("follows").findOne({
      follower: session.user.id,
      following: targetUser._id
    });
    
    if (existingFollow) {
      await db.collection("follows").deleteOne({
        follower: session.user.id,
        following: targetUser._id
      });
      
      return NextResponse.json({ following: false });
    } else {
      await db.collection("follows").insertOne({
        follower: session.user.id,
        following: targetUser._id,
        createdAt: new Date()
      });
      
      return NextResponse.json({ following: true });
    }
  } catch (error) {
    console.error("フォロー処理エラー:", error);
    return NextResponse.json(
      { error: "フォロー処理中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

export async function GET(
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
    
    const targetUsername = params.username;
    
    if (!targetUsername) {
      return NextResponse.json(
        { error: "ユーザー名が指定されていません" },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db();
    
    const targetUser = await db.collection("users").findOne({
      username: targetUsername
    });
    
    if (!targetUser) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      );
    }
    
    const existingFollow = await db.collection("follows").findOne({
      follower: session.user.id,
      following: targetUser._id
    });
    
    return NextResponse.json({ following: !!existingFollow });
  } catch (error) {
    console.error("フォロー状態確認エラー:", error);
    return NextResponse.json(
      { error: "フォロー状態の確認中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
