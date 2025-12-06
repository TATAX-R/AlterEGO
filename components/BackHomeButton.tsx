import { Button, Text } from 'tamagui';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function BackHomeButton() {
  const router = useRouter();
  return (
    <Button
      margin={10}
      w="100%"
      backgroundColor="$color1"
      shadowColor="#fff"
      shadowOffset={{ width: 2, height: 2 }}
      shadowOpacity={0.3}
      shadowRadius={4}
      borderRadius={8}
      onPress={() => router.dismissAll()}>
      <Text>戻る</Text>
    </Button>
  );
}
