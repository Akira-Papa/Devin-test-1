'use client';

import React from 'react';
import { useState } from 'react';
import { Button, Card, CardContent, Typography, Radio, RadioGroup, FormControlLabel, Alert } from '@mui/material';
import type { Quiz } from '@/services/openai';

interface RadioChangeEvent {
  target: {
    value: string;
  };
}

export default function QuizPage() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateNewQuiz = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/quiz');
      if (!response.ok) {
        throw new Error('クイズの生成に失敗しました');
      }
      const data = await response.json();
      setQuiz(data);
      setSelectedAnswer(null);
      setShowResult(false);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      setError('クイズの生成中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Typography variant="h4" component="h1" gutterBottom>
        4択クイズ
      </Typography>

      <Button
        variant="contained"
        onClick={generateNewQuiz}
        disabled={loading}
        className="mb-4"
        aria-label={loading ? 'クイズを生成中' : '新しいクイズを生成'}
      >
        {loading ? '生成中...' : '新しいクイズを生成'}
      </Button>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      {quiz && (
        <Card className="mt-4">
          <CardContent>
            <Typography variant="h6" component="h2" gutterBottom>
              {quiz.question}
            </Typography>

            <RadioGroup
              value={selectedAnswer}
              onChange={(e: RadioChangeEvent) => setSelectedAnswer(Number(e.target.value))}
              aria-label="クイズの選択肢"
            >
              {quiz.choices.map((choice: string, index: number) => (
                <FormControlLabel
                  key={index}
                  value={index}
                  control={<Radio />}
                  label={choice}
                  disabled={showResult}
                  className="my-2"
                />
              ))}
            </RadioGroup>

            {!showResult && selectedAnswer !== null && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowResult(true)}
                className="mt-4"
                aria-label="回答を確認"
              >
                回答する
              </Button>
            )}

            {showResult && (
              <div className="mt-4" role="alert">
                <Alert severity={selectedAnswer === quiz.correctAnswer ? "success" : "error"}>
                  {selectedAnswer === quiz.correctAnswer ? "正解！" : "不正解..."}
                </Alert>
                <Typography variant="body1" className="mt-2">
                  解説: {quiz.explanation}
                </Typography>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
