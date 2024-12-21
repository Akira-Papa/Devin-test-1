import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuizPage from '../page';

// APIレスポンスのモック
const mockQuiz = {
  question: 'テスト問題',
  choices: ['選択肢1', '選択肢2', '選択肢3', '選択肢4'],
  correctAnswer: 0,
  explanation: 'テスト解説',
};

// fetchのモック
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockQuiz),
  })
) as jest.Mock;

describe('QuizPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('クイズ生成ボタンが表示される', () => {
    render(<QuizPage />);
    expect(screen.getByText('新しいクイズを生成')).toBeInTheDocument();
  });

  it('クイズ生成後に問題が表示される', async () => {
    render(<QuizPage />);

    // クイズ生成ボタンをクリック
    fireEvent.click(screen.getByText('新しいクイズを生成'));

    // ローディング状態の確認
    expect(screen.getByText('生成中...')).toBeInTheDocument();

    // クイズが表示されるまで待機
    await waitFor(() => {
      expect(screen.getByText('テスト問題')).toBeInTheDocument();
    });

    // 選択肢が表示されていることを確認
    mockQuiz.choices.forEach((choice) => {
      expect(screen.getByText(choice)).toBeInTheDocument();
    });
  });

  it('正解を選択して回答すると結果が表示される', async () => {
    render(<QuizPage />);

    // クイズを生成
    fireEvent.click(screen.getByText('新しいクイズを生成'));

    await waitFor(() => {
      expect(screen.getByText('テスト問題')).toBeInTheDocument();
    });

    // 正解の選択肢を選択
    fireEvent.click(screen.getByText('選択肢1'));

    // 回答ボタンをクリック
    fireEvent.click(screen.getByText('回答する'));

    // 正解のメッセージが表示される
    expect(screen.getByText('正解！')).toBeInTheDocument();
    expect(screen.getByText(/解説: テスト解説/)).toBeInTheDocument();
  });

  it('APIエラー時にエラーメッセージが表示される', async () => {
    // エラーレスポンスをモック
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(<QuizPage />);

    fireEvent.click(screen.getByText('新しいクイズを生成'));

    await waitFor(() => {
      expect(screen.getByText(/クイズの生成中にエラーが発生しました/)).toBeInTheDocument();
    });
  });
});
