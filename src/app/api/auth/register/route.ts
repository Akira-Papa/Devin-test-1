import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import clientPromise from "../../../../lib/mongodb";

export async function POST(req: Request) {
  try {
    const { name, email, password, username } = await req.json();

    if (!name || !email || !password || !username) {
      return NextResponse.json(
        { error: "必須項目が入力されていません" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    
    const existingUser = await db.collection("users").findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "このメールアドレスまたはユーザー名は既に使用されています" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection("users").insertOne({
      name,
      email,
      username,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { message: "ユーザーが正常に登録されました", userId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("ユーザー登録エラー:", error);
    return NextResponse.json(
      { error: "ユーザー登録中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
