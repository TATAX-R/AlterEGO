import { useState } from 'react';
import { Image, StyleSheet, View, Alert, Text } from 'react-native';
import Button from '@/components/button';
import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

{
  /*
    このComponentは以下の機能を担当する。
    1. カメラ機能の呼び出し
    2. 撮影機能の呼び出し
    3. return は画像ファイルを返す。(キャンセル時はその処理も書く。)    
*/
}
export default function CameraCallComponent() {
  const geminiprompt = `# Prompt
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
DiseaseTypeの数値の範囲は-10から10にしてください。
`;

  // 撮影した画像のURIを保存するステート
  const [image, setImage] = useState<string | null>(null);
  const [apiReply, setApiReply] = useState('');
  const [isTakenPicture, setIsTakenPicture] = useState(false);
  const [isPressedSendButton, setIsPressedSendButton] = useState(false);
  const [aiMessage, setAimessage] = useState('');
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
    setIsTakenPicture(true);
  };

  const processImage = async (uri: string) => {
    //manipulateはImageManipulaatorクラスにあるメソッドらしい
    const context = ImageManipulator.manipulate(uri);

    //リサイズなどの命令チェーンみたいな感じで記述することが可能
    //実行はされず命令がたまるだけ
    context.resize({ width: 800 });

    //renderAsyncで画像処理を実行して、メモリ上に画像を生成するらしい
    const imageRef = await context.renderAsync();
    console.log('画像処理実行完了');
    //saveAsync()でファイルとして保存(圧縮設定はここで行う)
    //画像の圧縮率をここで設定
    const saveResult = await imageRef.saveAsync({
      format: SaveFormat.JPEG,
      compress: 0.5, //圧縮率
      base64: true,
    });
    console.log('圧縮済みファイルを保存完了');
    return saveResult;
  };

  const callapi = async (base64Data: string) => {
    try {
      const response = await fetch('/gemini', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          base64Data: base64Data,
          prompt: geminiprompt,
        }),
      });
      const result = await response.json();
      console.log(result);
      return result;
    } catch (error) {
      console.error('通信エラー', error);
      return { error: '通信エラーが発生しました' };
    }
  };

  const handleImageProcessing = async (uri: string) => {
    try {
      console.log('画像処理を開始...');
      // A. 画像処理を実行
      const processedResult = await processImage(uri);

      // B. base64があるかチェックして取り出す
      if (processedResult.base64) {
        console.log('API送信を開始...');

        // ★ここがポイント！ .base64 をつけて中身だけを渡す
        const result = await callapi(processedResult.base64);
        return result;
      } else {
        console.error('Base64データの生成に失敗しました');
        return { text: 'エラー: Base64データの生成に失敗しました', error: true };
      }
    } catch (e) {
      console.error('処理中にエラーが発生:', e);
      return { text: `エラー: 処理中にエラーが発生しました (${e})`, error: true };
    }
  };
  return (
    <View style={styles.container}>
      {/* 画像がある場合は表示する */}
      {image && !isPressedSendButton && (
        <View>
          <Image source={{ uri: image }} style={styles.image} />
          <Button
            label="画像を送信する"
            onPress={async () => {
              setIsPressedSendButton(true);
              console.log('送信テスト1:ボタンのpushを確認');
              //geminiAPI発火処理を書く
              const processedImage = await processImage(image);
              console.log(processedImage);
              console.log('=========上記が画像です==========');
              console.log('これからapiに送信します');
              const apihento = await handleImageProcessing(image);
              console.log(apihento);
              if (apihento?.text) {
                setApiReply(JSON.stringify(apihento));
                console.error('apiから入ってきた返答でtextオブジェクトが存在していません。');
              }
              setApiReply(JSON.stringify(apihento));
              const aimessageconst = apihento.message;
              setAimessage(aimessageconst);

              console.log('Aimessageに', { aimessageconst }, 'を代入しました');
            }}
            theme="primary"
          />
          <Text style={styles.text}>{aiMessage}</Text>
        </View>
      )}

      {/* このボタンを押すと takePhoto 関数が発火 */}
      {!isTakenPicture && <Button label="カメラを起動する" onPress={takePhoto} theme="primary" />}
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
  text: {
    color: '#000',
    margin: 5,
  },
});
