import { FoodAnalysisResult } from './../types/index';
import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { base64Data, prompt } = body;
    if (!base64Data) {
      return Response.json({ error: 'No image data' }, { status: 400 });
    }
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY_KEY });

    const contents = [
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Data,
        },
      },

      { text: prompt }, //geminiへのプロンプト
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
    });
    console.log(response);
    if (!response) {
      console.log('responseが存在していません');
      return Response.json({ error: 'No response from AI' }, { status: 500 });
    }
    // パターンB: responseの中のresponseを見る
    const resultText = response.text;

    if (!resultText) {
      return Response.json({ text: 'resultTextが存在していませんエラーかなwwww' });
    }
    console.log('🔥 AI Raw Response:', resultText); // ← これを追加！！！
    const jsonRaw = JSON.parse(resultText);

    //ここでミスったらcatchにとばされますよ
    console.log(jsonRaw);
    return Response.json(jsonRaw);
  } catch (error) {
    console.error('API error:', error);
    if (process.env.NODE_ENV === 'development') {
      return Response.json(
        {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        { status: 500 }
      );
    } else {
      return Response.json({ error: 'ざんねんでしたエラーwwwwwwwwwwwww' }, { status: 500 });
    }
  }
}
