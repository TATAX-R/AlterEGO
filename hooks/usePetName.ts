// hooks/usePetName.ts
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'pet_name_data'; // 保存キー

export const usePetName = () => {
  // 初期値（プレースホルダー）
  const [petName, setPetName] = useState('オルター');

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
      }
    };
    loadPetName();
  }, []);

  // 2. 名前を更新して保存する関数
  const updatePetName = async (newName: string) => {
    const previousName = petName; // 1. 変更前の名前を覚えておく

    try {
      setPetName(newName); // 2. いったん画面を更新
      await AsyncStorage.setItem(STORAGE_KEY, newName); // 3. 保存を試みる
    } catch (e) {
      console.error('Failed to save pet name:', e);

      // 4. 失敗したので、画面の表示を元に戻す
      setPetName(previousName);

      // 5. ユーザーに失敗したことを伝える
      Alert.alert('保存に失敗しました', '元の名前に戻します。');
    }
  };

  return {
    petName,
    updatePetName,
  };
};
