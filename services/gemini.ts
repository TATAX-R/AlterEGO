import { FoodAnalysisResult } from '@/types';

const GEMINI_PROMPT = `# Role
あなたは料理写真を分析し、健康への影響を判定する栄養管理AIです。

# Goal
提供された料理の画像または説明に基づき、指定されたJSONフォーマットで分析結果を出力してください。

# Output Constraints (重要)
- 出力は **生のJSON文字列のみ** を返してください。
- Markdown記法（コードブロック json ）は **絶対に使用しないでください**。
- 回答は必ず "{" で始まり、 "}" で終わってください。
- 冒頭や末尾に挨拶や説明文（「はい、分かりました」「結果は以下の通りです」等）を含めないでください。

# Data Schema
出力するJSONは以下のTypeScript定義に従ってください。

typescript
type DiseaseType = 'obesity' | 'diabetes' | 'hypertension' | 'dyslipidemia' | 'gout';

type FoodAnalysisResult = {
  isFood: boolean;      // 食べ物として認識されたか
  foodName: string;     // 料理名(日本語で出力すること) (「〜と思われます」等の曖昧な表現は禁止)
  impact: {             // 各パラメータへの増減値 (-10 to 10)
    [key in DiseaseType]: number; // 健康な食品の場合は負の値も可
  };
  message: string;      // 日本語で50文字以内で健康アドバイスを提供
};`;

export const fetchFoodAnalysis = async (base64Data: string): Promise<FoodAnalysisResult> => {
  try {
    const response = await fetch('/gemini', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        base64Data: base64Data,
        prompt: GEMINI_PROMPT,
      }),
    });
    const result = await response.json();
    console.log('==========services/gemini.tsが受け取ったresponse============');
    console.log(result);
    console.log('============================================================');
    return result;
  } catch (error) {
    console.error('通信エラー', error);
    return {
      isFood: false,
      foodName: '通信エラーです',
      impact: {
        obesity: 0,
        diabetes: 0,
        hypertension: 0,
        dyslipidemia: 0,
        gout: 0,
      },
      message: '通信エラーです',
    };
  }
};
