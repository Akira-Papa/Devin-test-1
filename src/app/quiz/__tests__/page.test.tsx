import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import QuizPage from "../page";

// APIレスポンスのモック
const mockQuiz = {
  question: "テスト問題",
  choices: ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
  correctAnswer: 0,
  explanation: "テスト解説",
};

// fetchのモック
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockQuiz),
  })
) as jest.Mock;

describe("QuizPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("クイズ生成ボタンが表示される", () => {
    render(<QuizPage />);
    expect(screen.getByText("新しいクイズを生成")).toBeInTheDocument();
  });

  it("クイズ生成後に問題が表示される", async () => {
    render(<QuizPage />);

    // クイズ生成ボタンをクリック
    fireEvent.click(screen.getByText("新しいクイズを生成"));

    // クイズが表示されるまで待機
    await waitFor(() => {
      expect(screen.getByText("テスト問題")).toBeInTheDocument();
    });
  });
});
