export interface Quiz {
  question: string;
  choices: string[];
  correctAnswer: number;
  explanation: string;
}

export async function generateQuiz(): Promise<Quiz> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured');
  }

  const prompt = `
クイズを1問生成してください。以下の形式のJSONで出力してください：
{
  "question": "問題文をここに記述",
  "choices": ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
  "correctAnswer": 0,
  "explanation": "解説文をここに記述"
}

条件：
- 問題は一般常識や雑学に関するものにしてください
- 選択肢は4つ用意してください
- correctAnswerは0から3の数値で、正解の選択肢のインデックスを示します
- 解説は100文字程度で、なぜその答えが正解なのかを説明してください
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('Invalid response from OpenAI API');
    }

    const quiz: Quiz = JSON.parse(content);
    return quiz;
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
}
