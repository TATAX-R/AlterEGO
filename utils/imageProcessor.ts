import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

export const compressAndConvertToBase64 = async (uri: string): Promise<string> => {
  try {
    const context = ImageManipulator.manipulate(uri);
    context.resize({ width: 800 });
    const imageRef = await context.renderAsync();

    const saveResult = await imageRef.saveAsync({
      format: SaveFormat.JPEG,
      compress: 0.5, //圧縮率（応答の精度はここで調整するべし）
      base64: true,
    });

    if (!saveResult.base64) {
      throw new Error('Base64変換に失敗しました');
    }
    return saveResult.base64;
  } catch (error) {
    console.error('Image Processing Error:', error);
    throw error;
  }
};
