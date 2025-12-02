import { useState } from 'react';
import { Image, StyleSheet, View, Alert } from 'react-native';
import Button from '@/components/button';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  // 撮影した画像のURIを保存するステート
  const [image, setImage] = useState<string | null>(null);

  /**
   * カメラを起動する関数
   * ボタンが押されたときに発火します
   */
  const takePhoto = async () => {
    // 1. カメラのアクセス許可をリクエスト
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('エラー', 'カメラへのアクセス許可が必要です。');
      return;
    }

    // 2. カメラを起動 (launchCameraAsync)
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images', // 画像のみ許可
      allowsEditing: true, // 撮影後のトリミング編集を許可するか
      aspect: [4, 3], // アスペクト比
      quality: 1, // 画質 (0〜1)
    });

    // 3. 撮影がキャンセルされなかった場合、画像を表示
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {/* 画像がある場合は表示する */}
      {image && (
        <View>
          <Image source={{ uri: image }} style={styles.image} />
          <Button
            label="画像を送信する"
            onPress={() => {
              console.log('送信テスト1:ボタンのpushを確認');
            }}
            theme="primary"
          />
        </View>
      )}

      {/* このボタンを押すと takePhoto 関数が発火 */}
      <Button label="カメラを起動する" onPress={takePhoto} theme="primary" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
});
