// hooks/usePetName.ts
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'pet_name_data'; // 保存キー

export const usePetName = () => {
  // 初期値（プレースホルダー）
  const [petName, setPetName] = useState('タタックス');
  const [isLoading, setIsLoading] = useState(true);
  const [saveError, setSaveError] = useState<Error | null>(null);

  // 1. 初回起動時に保存された名前を読み込む
  useEffect(() => {
    const loadPetName = async () => {
      try {
        const storedName = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedName) {
          setPetName(storedName);
        }
      } catch (e) {
        console.error('Failed to load pet name:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadPetName();
  }, []);

  // 2. 名前を更新して保存する関数
  const updatePetName = useCallback(async (newName: string) => {
    const previousName = petName; // 現在の名前を保存
    setSaveError(null); // エラー状態をリセット

    try {
      setPetName(newName); // 画面を即更新（楽観的更新）
      await AsyncStorage.setItem(STORAGE_KEY, newName); // 裏で保存
    } catch (e) {
      console.error('Failed to save pet name:', e);
      setPetName(previousName); // 保存失敗時は前の名前に戻す
      setSaveError(e instanceof Error ? e : new Error('Failed to save pet name'));
    }
  }, [petName]);

  // エラー状態をクリアする関数
  const clearSaveError = useCallback(() => {
    setSaveError(null);
  }, []);

  return {
    petName,
    isLoading,
    saveError,
    updatePetName,
    clearSaveError,
  };
};
