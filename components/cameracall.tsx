import { Image, StyleSheet, View, Alert, Text } from 'react-native';

{
  /*
    このComponentは以下の機能を担当する。
    1. カメラ機能の呼び出し
    2. 撮影機能の呼び出し
    3. return は画像ファイルを返す。(キャンセル時はその処理も書く。)    
*/
}
export default function CameraCallComponent() {
  return <View style={styles.container}></View>;
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
