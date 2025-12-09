import React from 'react';
import { ScrollView } from 'react-native';
import { YStack, XStack, Text, Button, Separator, H3, Card } from 'tamagui';
import { usePetStateContext } from '@/hooks/usePetState';
import { DiseaseType } from '@/types';
import { DISEASE_KEYS, diseaseData } from '@/constants/diseases';

export default function DebugScreen() {
  const {
    petState,
    isLoading,
    survivalDays,
    updateStats,
    updateMood,
    updateActiveSymptom,
    updateDeathRiskLevel,
    killPet,
    revivePet,
    setBirthDate,
  } = usePetStateContext();

  if (isLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Text>Loading...</Text>
      </YStack>
    );
  }

  // パラメータを増減
  const adjustStat = (key: DiseaseType, amount: number) => {
    updateStats({ [key]: amount });
  };

  // 全パラメータを特定値に設定
  const setAllStatsTo = (value: number) => {
    const updates: Partial<Record<DiseaseType, number>> = {};
    DISEASE_KEYS.forEach((key) => {
      const diff = value - petState.stats[key];
      updates[key] = diff;
    });
    updateStats(updates);
  };

  // 生存日数を設定
  const setSurvivalDays = (days: number) => {
    const newBirthDate = new Date();
    newBirthDate.setDate(newBirthDate.getDate() - days);
    setBirthDate(newBirthDate);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <YStack padding="$4" gap="$4" paddingTop={60}>
        <H3 textAlign="center">🛠️ デバッグ画面</H3>

        {/* 現在の状態表示 */}
        <Card elevate bordered padding="$3">
          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold">
              📊 現在の状態
            </Text>
            <Separator />
            <XStack justifyContent="space-between">
              <Text>生存状態:</Text>
              <Text fontWeight="bold" color={petState.isAlive ? '$green10' : '$red10'}>
                {petState.isAlive ? '🌟 生存' : '💀 死亡'}
              </Text>
            </XStack>
            <XStack justifyContent="space-between">
              <Text>生存日数:</Text>
              <Text fontWeight="bold">{survivalDays} 日</Text>
            </XStack>
            <XStack justifyContent="space-between">
              <Text>危険度レベル:</Text>
              <Text
                fontWeight="bold"
                color={
                  petState.deathRiskLevel === 'safe'
                    ? '$green10'
                    : petState.deathRiskLevel === 'warning'
                      ? '$yellow10'
                      : '$red10'
                }>
                {petState.deathRiskLevel}
              </Text>
            </XStack>
            <XStack justifyContent="space-between">
              <Text>機嫌:</Text>
              <Text fontWeight="bold">{petState.mood}</Text>
            </XStack>
            <XStack justifyContent="space-between">
              <Text>症状:</Text>
              <Text fontWeight="bold" numberOfLines={1}>
                {petState.activeSymptom?.text ?? 'なし'}
              </Text>
            </XStack>
          </YStack>
        </Card>

        {/* 生存日数設定 */}
        <Card elevate bordered padding="$3">
          <YStack gap="$3">
            <Text fontSize="$6" fontWeight="bold">
              📅 生存日数設定
            </Text>
            <Separator />
            <XStack gap="$2" flexWrap="wrap">
              <Button size="$3" onPress={() => setSurvivalDays(0)}>
                0日
              </Button>
              <Button size="$3" onPress={() => setSurvivalDays(7)}>
                7日
              </Button>
              <Button size="$3" onPress={() => setSurvivalDays(30)}>
                30日
              </Button>
              <Button size="$3" onPress={() => setSurvivalDays(100)}>
                100日
              </Button>
              <Button size="$3" onPress={() => setSurvivalDays(365)}>
                365日
              </Button>
            </XStack>
          </YStack>
        </Card>

        {/* 健康パラメータ */}
        <Card elevate bordered padding="$3">
          <YStack gap="$3">
            <Text fontSize="$6" fontWeight="bold">
              💉 健康パラメータ
            </Text>
            <Separator />
            {DISEASE_KEYS.map((key) => (
              <YStack key={key} gap="$2">
                <XStack justifyContent="space-between" alignItems="center">
                  <Text flex={1} fontWeight="bold">
                    {diseaseData[key].name}
                  </Text>
                  <Text fontWeight="bold" fontSize="$5" width={50} textAlign="right">
                    {petState.stats[key]}
                  </Text>
                </XStack>
                <XStack gap="$2" justifyContent="space-between">
                  <Button size="$2" onPress={() => adjustStat(key, -10)}>
                    -10
                  </Button>
                  <Button size="$2" onPress={() => adjustStat(key, -5)}>
                    -5
                  </Button>
                  <Button size="$2" onPress={() => adjustStat(key, -1)}>
                    -1
                  </Button>
                  <Button size="$2" onPress={() => adjustStat(key, 1)}>
                    +1
                  </Button>
                  <Button size="$2" onPress={() => adjustStat(key, 5)}>
                    +5
                  </Button>
                  <Button size="$2" onPress={() => adjustStat(key, 10)}>
                    +10
                  </Button>
                </XStack>
              </YStack>
            ))}
          </YStack>
        </Card>

        {/* 状態再計算 */}
        <Card elevate bordered padding="$3">
          <YStack gap="$3">
            <Text fontSize="$6" fontWeight="bold">
              ⚡ 状態を再計算
            </Text>
            <Separator />

            <Button onPress={updateMood}>
              <YStack alignItems="center">
                <Text fontWeight="bold">🎭 機嫌を再計算</Text>
                <Text fontSize="$2" color="$gray10">
                  updateMood()
                </Text>
              </YStack>
            </Button>

            <Button onPress={updateActiveSymptom}>
              <YStack alignItems="center">
                <Text fontWeight="bold">💬 症状を再計算</Text>
                <Text fontSize="$2" color="$gray10">
                  updateActiveSymptom()
                </Text>
              </YStack>
            </Button>

            <Button onPress={updateDeathRiskLevel}>
              <YStack alignItems="center">
                <Text fontWeight="bold">⚠️ 危険度を再計算</Text>
                <Text fontSize="$2" color="$gray10">
                  updateDeathRiskLevel()
                </Text>
              </YStack>
            </Button>

            <Separator />

            <XStack gap="$2">
              {petState.isAlive ? (
                <Button flex={1} backgroundColor="$red10" color="white" onPress={killPet}>
                  <YStack alignItems="center">
                    <Text fontWeight="bold" color="white">
                      💀 ペットを死亡させる
                    </Text>
                    <Text fontSize="$2" color="white" opacity={0.7}>
                      killPet()
                    </Text>
                  </YStack>
                </Button>
              ) : (
                <Button flex={1} backgroundColor="$green10" color="white" onPress={revivePet}>
                  <YStack alignItems="center">
                    <Text fontWeight="bold" color="white">
                      🌟 ペットを復活させる
                    </Text>
                    <Text fontSize="$2" color="white" opacity={0.7}>
                      revivePet()
                    </Text>
                  </YStack>
                </Button>
              )}
            </XStack>
          </YStack>
        </Card>

        {/* パラメータ一括設定 */}
        <Card elevate bordered padding="$3">
          <YStack gap="$3">
            <Text fontSize="$6" fontWeight="bold">
              🎛️ プリセット
            </Text>
            <Separator />
            <YStack gap="$2">
              <Button size="$4" onPress={() => setAllStatsTo(0)}>
                🌈 全パラメータを 0 にリセット
              </Button>
              <Button size="$4" onPress={() => setAllStatsTo(25)}>
                💚 全パラメータを 25 に設定
              </Button>
              <Button size="$4" onPress={() => setAllStatsTo(50)}>
                ⚠️ 全パラメータを 50 に設定
              </Button>
              <Button size="$4" onPress={() => setAllStatsTo(75)}>
                🔶 全パラメータを 75 に設定
              </Button>
              <Button size="$4" backgroundColor="$red10" onPress={() => setAllStatsTo(100)}>
                <Text color="white" fontWeight="bold">
                  ☠️ 全パラメータを 100 に設定（最大）
                </Text>
              </Button>
            </YStack>
          </YStack>
        </Card>

        <YStack height={100} />
      </YStack>
    </ScrollView>
  );
}
