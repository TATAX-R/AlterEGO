import { Text, Image, XStack, YStack } from 'tamagui';
import { StyleSheet } from 'react-native';

export default function ImagePreview({ imageUri }: { imageUri: string }) {
  return (
    <>
      <YStack>
        <Image
          source={{ uri: imageUri }}
          width={300}
          height={250}
          borderWidth={0.5}
          borderColor="white"
          borderRadius={20}
        />
      </YStack>
    </>
  );
}
