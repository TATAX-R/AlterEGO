import { Text, Image, XStack, YStack } from 'tamagui';
import { StyleSheet } from 'react-native';

export default function ImagePreview({ imageUri }: { imageUri: string }) {
  return (
    <>
      <YStack>
        <Image source={{ uri: imageUri }} style={styles.image} />
      </YStack>
    </>
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
    width: 350,
    height: 300,
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 10,
  },
  text: {
    color: '#fff',
    margin: 5,
  },
});
