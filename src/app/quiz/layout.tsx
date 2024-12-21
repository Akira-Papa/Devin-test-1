import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "4択クイズ | Next.js App",
  description: "ChatGPT APIを使用した4択クイズアプリケーション",
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-8">{children}</main>
    </div>
  );
}
