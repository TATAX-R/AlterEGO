// components/PetName/PetNameEditModal.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, Button, YStack, XStack, Text, Input, Separator } from 'tamagui';

type Props = {
  visible: boolean;
  currentName: string;
  onClose: () => void;
  onSave: (newName: string) => void;
};

const MAX_NAME_LENGTH = 10;

export const PetNameEditModal = ({ visible, currentName, onClose, onSave }: Props) => {
  const [name, setName] = useState(currentName);
  const [showWarning, setShowWarning] = useState(false);

  // モーダルが開くたびに、今の名前をセット
  useEffect(() => {
    if (visible) {
      setName(currentName);
      setShowWarning(false);
    }
  }, [visible, currentName]);

  const handleTextChange = (text: string) => {
    if (text.length > MAX_NAME_LENGTH) {
      setShowWarning(true);
      setName(text.slice(0, MAX_NAME_LENGTH)); // 10文字に切り詰め
    } else {
      setShowWarning(false);
      setName(text);
    }
  };

  const handleSave = () => {
    // 名前が空または空白のみの場合は保存しない
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }
    onSave(trimmedName);
    onClose();
  };

  return (
    <Dialog modal open={visible} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          backgroundColor="black"
        />

        <Dialog.Content
          bordered
          elevate
          key="content"
          animateOnly={['transform', 'opacity']}
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          gap="$4"
          width="90%"
          maxWidth={400}
          backgroundColor="$background">
          <YStack gap="$3">
            {/* タイトル */}
            <Dialog.Title size="$8" fontWeight="bold" color="$color" textAlign="center">
              名前を変更
            </Dialog.Title>

            <Separator borderColor="$color5" />

            {/* 入力フィールド */}
            <Input
              size="$4"
              value={name}
              onChangeText={handleTextChange}
              placeholder="新しい名前を入力"
              autoFocus
              textAlign="center"
              borderWidth={0}
              borderBottomWidth={1}
              borderBottomColor="$color5"
              borderRadius={0}
              backgroundColor="transparent"
            />

            {/* 警告メッセージ */}
            {showWarning && (
              <Text fontSize="$2" color="$red10" textAlign="center">
                10文字以内で入力してください
              </Text>
            )}
          </YStack>

          {/* ボタン */}
          <XStack gap="$3" justifyContent="center">
            <Button flex={1} size="$4" backgroundColor="$color4" color="$color11" onPress={onClose}>
              キャンセル
            </Button>
            <Button
              flex={1}
              size="$4"
              theme="active"
              backgroundColor="$blue9"
              color="white"
              onPress={handleSave}>
              保存
            </Button>
          </XStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};
