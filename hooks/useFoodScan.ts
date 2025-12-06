import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { useState } from 'react';
import { compressAndConvertToBase64 } from '@/utils/imageProcessor';
import { fetchFoodAnalysis } from '@/services/gemini';
import { FoodAnalysisResult } from '@/types';
import { useRouter } from 'expo-router';
// 撮影した画像のURIを保存するステート

export const useFoodScan = () => {
  //画像のuriと分析結果を格納する状態管理を定義
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysisResult | null>(null);

  //モーダルの開閉管理
  const [isPreviewVisible, setIsPreviewVisible] = useState(false); //プレビューに使用
  const [isResultVisible, setIsResultVisible] = useState(false); //　結果表示用
  //ローディング状態管理
  const [isLoading, setIsLoading] = useState(false);

  const [isSuccess, setIsSuccess] = useState(true);
  // ---実際の動作を行う関数を定義する---
  //カメラの使用許可&写真を4:3の比率で撮影
  const startCamera = async (): Promise<string> => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      Alert.alert('権限エラー', 'カメラの使用許可を設定からお願いします。');
      return 'error';
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
      setIsPreviewVisible(true);
      return result.assets[0].uri;
    }
    return 'error';
  };

  //解析実行
  const executeAnalysis = async (imageUri: string) => {
    if (!imageUri) {
      return;
    }

    try {
      setIsLoading(true);

      //Utilsの圧縮関数を利用する
      const base64 = await compressAndConvertToBase64(imageUri);

      //Servicesを使用してAPIを送信する
      const result = await fetchFoodAnalysis(base64);
      setAnalysisResult(result);
      return result;
    } catch (error) {
      console.log('error by useFoodScan.ts', error);
    } finally {
      setIsLoading(false);
    }
  };

  //リセット(結果画面を閉じて最初に戻る)
  const resetScan = () => {
    setImageUri(null);
    setAnalysisResult(null);
    setIsResultVisible(false);
    setIsPreviewVisible(false);
  };

  //再撮影
  const retakePhoto = () => {
    setImageUri(null);
    setIsPreviewVisible(false);
    startCamera();
  };

  return {
    //Data
    imageUri,
    analysisResult,
    isLoading,
    isSuccess,
    //Modal States
    isPreviewVisible,
    isResultVisible,

    //Functions
    setIsSuccess,
    startCamera,
    executeAnalysis,
    resetScan,
    retakePhoto,
    setImageUri,
    setIsPreviewVisible,
    setIsResultVisible,
    setIsLoading,
  };
};
