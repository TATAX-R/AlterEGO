import { Text, XStack, YStack } from 'tamagui';
import { usePetState } from '@/hooks/usePetState';
import LottieView from 'lottie-react-native';
import RadarChartView from '@/components/radar-chart';
import { StyleSheet } from 'react-native';

export default function HealthScreen() {
  const {
    // 状態
    petState,
    isLoading,

    // 計算値
    survivalDays,

    // 更新関数
    updateStats,
    feedPet,
    updateMood,
    updateActiveSymptom,
    updateDeathRiskLevel,
    killPet,
    revivePet,
  } = usePetState();
  const safeMessage = 'とてもげんきです！';
  const warningMessage = 'どこかに不調があるかもしれません...';
  const dangerMessage = '危険な状態です';

  return (
    <YStack alignItems="center" h="100%" padding={1} backgroundColor="$color1">
      <YStack h={70} />
      <XStack
        backgroundColor="$accent1"
        w={20}
        h={60}
        position="absolute"
        height="10%"
        right="65%"
        borderColor="$accent2"
        borderRadius={0.5}
      />
      <XStack
        backgroundColor="$accent1"
        w={20}
        h={60}
        position="absolute"
        height="10%"
        right="35%"
        borderColor="$accent2"
        borderRadius={0.5}
      />

      {/* 死亡危険度を示す */}
      <XStack
        backgroundColor="$accent1"
        padding={12}
        borderRadius={12}
        shadowColor="$accent4"
        shadowOffset={{ width: 2, height: 2 }}
        shadowOpacity={0.3}
        shadowRadius={4}
        alignItems="center"
        borderColor="$accent2"
        borderWidth={0.5}>
        {petState.deathRiskLevel === 'safe' ? (
          <Text fontSize={20} fontWeight="bold" color="#333" textAlign="center">
            {safeMessage}
          </Text>
        ) : (
          <></>
        )}
        {petState.deathRiskLevel === 'warning' ? (
          <Text fontSize={20} fontWeight="bold" color="#333" textAlign="center">
            {warningMessage}
          </Text>
        ) : (
          <></>
        )}
        {petState.deathRiskLevel === 'danger' ? (
          <Text fontSize={20} fontWeight="bold" color="#333" textAlign="center">
            {dangerMessage}
          </Text>
        ) : (
          <></>
        )}
        <Text fontSize={20} fontWeight="bold" color="#333" textAlign="center"></Text>
      </XStack>
      <LottieView
        source={
          petState.deathRiskLevel === 'safe'
            ? require('@/assets/lottie/pig-happy.json')
            : petState.deathRiskLevel === 'warning'
              ? require('@/assets/lottie/pig-idle.json')
              : require('@/assets/lottie/pig-sick.json')
        }
        style={styles.pigcharacter}
        autoPlay
        loop
      />
      <RadarChartView
        stats={{
          obesity: petState.stats.obesity,
          diabetes: petState.stats.diabetes,
          hypertension: petState.stats.hypertension,
          dyslipidemia: petState.stats.dyslipidemia,
          gout: petState.stats.gout,
        }}
      />
    </YStack>
  );
}

const styles = StyleSheet.create({
  pigcharacter: {
    width: '65%',
    height: '65%',
    position: 'absolute',
    top: '0.5%',
  },
  chart: {},
});
