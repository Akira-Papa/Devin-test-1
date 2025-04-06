import { ANTHROPIC_API_KEY } from './constants';

interface AICharacter {
  name: string;
  field: string;
  personality: string;
}

const AI_CHARACTERS: AICharacter[] = [
  {
    name: '佐藤 哲也',
    field: '科学技術',
    personality: '論理的で分析的。最新の科学研究に詳しく、複雑な概念を分かりやすく説明するのが得意。',
  },
  {
    name: '田中 歴史',
    field: '歴史文化',
    personality: '博識で物語を語るのが上手い。歴史的な文脈から現代の出来事を考察するのが好き。',
  },
  {
    name: '鈴木 経済',
    field: '経済金融',
    personality: '実用的で戦略的。経済トレンドを読むのが得意で、ビジネスの視点からアドバイスをする。',
  },
  {
    name: '山本 アート',
    field: '芸術デザイン',
    personality: '創造的で感性豊か。視覚的な表現や美的センスについて独自の視点を持っている。',
  },
];

export const selectCharacters = (postContent: string, count: number = 2): AICharacter[] => {
  const keywords = {
    科学技術: ['技術', 'AI', '科学', 'コンピュータ', 'プログラミング', '研究', '開発', 'テクノロジー'],
    歴史文化: ['歴史', '文化', '伝統', '昔', '時代', '古代', '江戸', '明治', '昭和', '平成'],
    経済金融: ['経済', 'お金', '投資', 'ビジネス', '市場', '株', '金融', '仕事', '起業'],
    芸術デザイン: ['デザイン', 'アート', '音楽', '映画', '絵', '写真', '美術', 'ファッション', '創作'],
  };

  const scores = AI_CHARACTERS.map(character => {
    const fieldKeywords = keywords[character.field as keyof typeof keywords] || [];
    let score = 0;
    
    fieldKeywords.forEach(keyword => {
      if (postContent.toLowerCase().includes(keyword.toLowerCase())) {
        score += 1;
      }
    });
    
    return { character, score };
  });

  scores.sort((a, b) => b.score - a.score);
  
  if (scores[0].score === scores[1].score) {
    scores.sort(() => Math.random() - 0.5);
  }
  
  const selectedCharacters = scores.filter(s => s.score > 0).map(s => s.character);
  
  while (selectedCharacters.length < count) {
    const randomCharacter = AI_CHARACTERS[Math.floor(Math.random() * AI_CHARACTERS.length)];
    if (!selectedCharacters.includes(randomCharacter)) {
      selectedCharacters.push(randomCharacter);
    }
  }
  
  return selectedCharacters.slice(0, count);
};

export const generateAIComment = async (
  postContent: string,
  character: AICharacter
): Promise<string> => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: `あなたは${character.name}という${character.field}の専門家です。${character.personality}

以下の投稿に対して、${character.name}らしい短いコメント（100文字程度）を日本語で書いてください。専門的な視点を交えつつも、親しみやすく、SNSのコメントとして自然な文体で書いてください。

投稿内容: "${postContent}"

コメント:`,
          },
        ],
      }),
    });

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('AIコメント生成エラー:', error);
    return `${character.name}からのコメントを生成できませんでした。`;
  }
};
