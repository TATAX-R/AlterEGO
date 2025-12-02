import { GoogleGenAI } from '@google/genai';

type Props = {
  imgurl: string;
};

const GEMINI_API_KEY_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

export default async function POST(request: Request) {
  try {
    const body = await request.json();
    const { base64Data, prompt } = body;
    if (!base64Data) {
      return Response.json({ error: 'No image data' }, { status: 400 });
    }
    const ai = new GoogleGenAI({
      apiKey: GEMINI_API_KEY_KEY,
    });
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ error: 'Server Error' }, { status: 500 });
  }
}
