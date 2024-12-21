import { NextResponse } from "next/server";
import { generateQuiz } from "@/services/openai";

export async function GET() {
  try {
    const quiz = await generateQuiz();
    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Error in quiz API route:", error);
    return NextResponse.json(
      { error: "クイズの生成に失敗しました。もう一度お試しください。" },
      { status: 500 },
    );
  }
}
