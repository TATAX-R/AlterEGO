import { FoodAnalysisResult } from '@/types';

const GEMINI_PROMPT = `# Prompt
あなたの仕事は送られてくる料理写真を分析して健康状態につながる要素を判定することです。

# 出力
返答はjson形式になるように返してください。他の説明の文字等を含めるとエラーを起こしてしまうので一切無駄な文字を含めないようにしてください。
またコードブロック形式では絶対に出力しないでください。
求める形式は以下の通りです。

export type FoodAnalysisResult = {
  isFood: boolean; // 食べ物として認識されたか
  foodName: string; // 料理名
  impact: {
    // 各パラメータへの増減値 (例: obesity: +5, diabetes: +2)
    [key in DiseaseType]: number;
  };
  message?: string; // AIからのコメント
};

またこの時のDiseaseTypeは以下の通りです
export type DiseaseType =
  | 'obesity' // 肥満
  | 'diabetes' // 糖尿病
  | 'hypertension' // 高血圧
  | 'dyslipidemia' // 脂質異常症
  | 'gout'; // 痛風

## 出力の際の注意点(形式)
食べ物の名前は(～と思われます)等のあいまいな表現を避けてください。
またmessageは最大50文字程度に収めてください。
出力の際にバッククォートやjsonという文字列を挿入しないでください
## 出力の際の注意点(数値)
DiseaseTypeのパラメータは健康な食品の場合は負の値も適用してください
食事の量も数値判定の材料として考慮してください。
DiseaseTypeの数値の範囲は-10から10にしてください。
`;

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
