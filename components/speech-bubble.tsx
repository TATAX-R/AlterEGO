import React, { useState } from 'react';
import { YStack, Text, Dialog, Button, Separator } from 'tamagui';
import { Symptom } from '@/types';

type Props = {
  symptom: Symptom;
};

// 統一された色設定
const BUBBLE_BACKGROUND = '$color5'; // 優しいクリーム色

export const SpeechBubble: React.FC<Props> = ({ symptom }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePress = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <YStack
        position="relative"
        alignItems="center"
        width="100%"
        $gtSm={{ width: 'auto' }}
        cursor="pointer"
        onPress={handlePress}
        pressStyle={{ scale: 0.98 }}>
        <YStack
          width="90%"
          maxWidth={280}
          $gtXs={{ maxWidth: 320 }}
          $gtSm={{ maxWidth: 350, borderRadius: '$5', padding: '$4' }}
          $gtMd={{ maxWidth: 400 }}
          minWidth={80}
          backgroundColor={BUBBLE_BACKGROUND}
          borderRadius="$4"
          shadowColor="rgba(0, 0, 0, 0.1)"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.8}
          shadowRadius={4}
          elevation={3}
          padding="$3"
          alignItems="center"
          justifyContent="center">
          <Text fontSize="$9" fontWeight="bold" color="#473C33">
            {symptom.text}
          </Text>
        </YStack>

        {/* 三角形（吹き出しの尻尾） */}
        <YStack
          marginTop={-1}
          width={0}
          height={0}
          shadowColor="rgba(0, 0, 0, 0.1)"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.8}
          shadowRadius={4}
          borderColor={BUBBLE_BACKGROUND}
          style={{
            borderLeftWidth: 8,
            borderRightWidth: 8,
            borderTopWidth: 14,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
          }}
        />
      </YStack>

      {/* Tips表示用モーダル */}
      <Dialog modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            animation="quick"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
            backgroundColor="black"
          />

          <Dialog.Content
            bordered
            elevate
            key="content"
            animation="quick"
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            gap="$4"
            width="90%"
            maxWidth={400}
            backgroundColor="$background">
            <YStack gap="$3">
              {/* タイトル */}
              <Dialog.Title size="$8" fontWeight="bold" color="$color" textAlign="center">
                {symptom.tipsTitle}
              </Dialog.Title>

              <Separator borderColor="$color5" />

              {/* 内容 */}
              <Text fontSize="$5" color="$color11" textAlign="center" lineHeight="$6">
                {symptom.tipsContent}
              </Text>
            </YStack>

            {/* 閉じるボタン */}
            <Button
              size="$4"
              backgroundColor="$blue9"
              color="white"
              onPress={() => setIsModalOpen(false)}>
              閉じる
            </Button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  );
};

export default SpeechBubble;
