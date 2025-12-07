import { XStack, YStack, Circle, Text, View } from 'tamagui';

type SimpleGaugeProps = {
  value: number;
  isMeasure?: boolean;
};

export const SimpleGauge = ({ value, isMeasure = false }: SimpleGaugeProps) => {
  const clampedValue = Math.min(Math.max(value, -10), 10);
  const percentage = ((clampedValue + 10) / 20) * 100;

  const tickColor = '$gray5';

  return (
    <YStack width={160} justifyContent="center">
      {/* ★修正ポイント: 
         テキストエリア全体を「箱」として定義し、その中に
         「両端の固定文字」と「動く数値」を重ねて配置します。
      */}
      <View height={24} width="100%" marginBottom="$1">
        {/* 1. 動かない文字 (-10 と 10) */}
        {isMeasure && (
          <XStack justifyContent="space-between" width="100%">
            <Text fontSize={10} color="$gray8">
              -10
            </Text>
            <Text fontSize={10} color="$gray8">
              10
            </Text>
          </XStack>
        )}

        {/* 2. 動く数値 (value) */}
        <XStack
          position="absolute"
          left={`${percentage}%`}
          width={40} // 文字の幅を確保
          justifyContent="center" // その幅の中で文字を中央揃え
          transform={[{ translateX: -20 }]} // 幅の半分(20px)だけ左に戻して中心を合わせる
        >
          <Text fontSize="$4" fontWeight="800" color="$blue10" textAlign="center">
            {value}
          </Text>
        </XStack>
      </View>

      <XStack
        height={6}
        width="100%"
        backgroundColor="white"
        position="relative"
        borderRadius={15}
        alignItems="center"
        top="0%">
        {/* 左端の目盛り */}
        <XStack position="absolute" left={0} height="100%" width={2} backgroundColor={tickColor} />

        {/* 真ん中の目盛り (0) */}
        <XStack
          position="absolute"
          left="50%"
          height={10}
          width={2}
          backgroundColor={tickColor}
          opacity={0.8}
          y={-2}
        />

        {/* 右端の目盛り */}
        <XStack position="absolute" right={0} height="100%" width={2} backgroundColor={tickColor} />

        <Circle
          size={12}
          backgroundColor="white"
          borderWidth={2}
          borderColor="white"
          elevation={2}
          position="absolute"
          left={`${percentage}%`}
          transform={[{ translateX: -9 }]}
        />
      </XStack>
    </YStack>
  );
};
