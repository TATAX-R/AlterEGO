import { Button, Text } from 'tamagui';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function BackHomeButton() {
  const router = useRouter();
  return (
    <Button style={styles.button} onPress={() => router.dismissAll()}>
      <Text>戻る</Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 50,
    left: 10,
  },
});
