import { Ionicons } from '@expo/vector-icons';
import { Button, Dialog, Unspaced, YStack, XStack, Separator } from 'tamagui';
import { Symptom } from '@/types';

export function Modal({ id, text, tipsTitle, tipsContent }: Symptom) {
  return (
    <Dialog modal>
      <Dialog.Trigger asChild>
        <Button theme="accent" size="$5" borderRadius="$10" fontWeight="bold">
          {tipsTitle} の詳細を見る
        </Button>
      </Dialog.Trigger>

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
          <YStack gap="$2">
            <Dialog.Title size="$9" fontWeight="bold" color="$color">
              {tipsTitle}
            </Dialog.Title>

            <Separator borderColor="$color" />

            <Dialog.Description size="$4" fontWeight="bold" color="$color" lineHeight={22}>
              {tipsContent}
            </Dialog.Description>
          </YStack>

          <XStack theme="accent" gap="$3" justifyContent="center">
            <Dialog.Close asChild>
              <Button>閉じる</Button>
            </Dialog.Close>
          </XStack>

          <Unspaced></Unspaced>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
