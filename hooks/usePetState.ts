// hooks/usePetState.ts
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PetState, HealthStats, DeathRiskLevel, DiseaseType, Symptom } from '@/types/index';

const STORAGE_KEY = 'pet_state_data';

// 死亡判定の閾値
const DEATH_THRESHOLD = 100; // いずれかのパラメータがこの値に達したら死亡
const DANGER_THRESHOLD = 80; // この値以上で危険状態
const WARNING_THRESHOLD = 50; // この値以上で警告状態

// AsyncStorage保存用の型（Date → string）
type SerializedPetState = Omit<PetState, 'birthDate' | 'lastFedDate'> & {
  birthDate: string;
  lastFedDate: string;
};

// 初期値
const createInitialPetState = (): PetState => ({
  isAlive: true,
  deathRiskLevel: 'safe',
  birthDate: new Date(),
  lastFedDate: new Date(),
  stats: {
    obesity: 0,
    diabetes: 0,
    hypertension: 0,
    dyslipidemia: 0,
    gout: 0,
  },
  mood: 'happy',
  activeSymptom: null,
});

export const usePetState = () => {
  const [petState, setPetState] = useState<PetState>(createInitialPetState());
  const [isLoading, setIsLoading] = useState(true);

  // =====================================
  // 1. 初回起動時に保存されたデータを読み込む
  // =====================================
  useEffect(() => {
    const loadPetState = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: SerializedPetState = JSON.parse(stored);
          // Date型に復元
          const restored: PetState = {
            ...parsed,
            birthDate: new Date(parsed.birthDate),
            lastFedDate: new Date(parsed.lastFedDate),
          };
          setPetState(restored);
        }
      } catch (e) {
        console.error('Failed to load pet state:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadPetState();
  }, []);

  // =====================================
  // 2. 保存処理（内部用）
  // =====================================
  const savePetState = useCallback(async (state: PetState) => {
    try {
      // Date型をISO文字列に変換して保存
      const serialized: SerializedPetState = {
        ...state,
        birthDate: state.birthDate.toISOString(),
        lastFedDate: state.lastFedDate.toISOString(),
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
    } catch (e) {
      console.error('Failed to save pet state:', e);
      Alert.alert('保存に失敗しました');
    }
  }, []);

  // =====================================
  // 3. 生存日数を計算
  // =====================================
  const getSurvivalDays = useCallback((): number => {
    const now = new Date();
    const birth = petState.birthDate;
    const diffTime = now.getTime() - birth.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [petState.birthDate]);

  // =====================================
  // 3.5. 死亡判定と危険度レベルを計算
  // =====================================
  const checkDeathCondition = useCallback(
    (stats: HealthStats): { shouldDie: boolean; riskLevel: DeathRiskLevel } => {
      const maxStat = Math.max(...Object.values(stats));

      if (maxStat >= DEATH_THRESHOLD) {
        return { shouldDie: true, riskLevel: 'danger' };
      } else if (maxStat >= DANGER_THRESHOLD) {
        return { shouldDie: false, riskLevel: 'danger' };
      } else if (maxStat >= WARNING_THRESHOLD) {
        return { shouldDie: false, riskLevel: 'warning' };
      } else {
        return { shouldDie: false, riskLevel: 'safe' };
      }
    },
    []
  );

  // =====================================
  // 4. 健康パラメータを更新（死亡判定付き）
  // =====================================
  const updateStats = useCallback(
    async (changes: Partial<HealthStats>) => {
      const newStats = { ...petState.stats };

      // 各パラメータを更新（0-100の範囲に収める）
      (Object.keys(changes) as DiseaseType[]).forEach((key) => {
        const newValue = newStats[key] + (changes[key] || 0);
        newStats[key] = Math.max(0, Math.min(100, newValue));
      });

      // 死亡判定
      const { shouldDie, riskLevel } = checkDeathCondition(newStats);

      const newState: PetState = {
        ...petState,
        stats: newStats,
        deathRiskLevel: riskLevel,
        isAlive: shouldDie ? false : petState.isAlive,
        mood: shouldDie ? 'sick' : petState.mood,
      };

      setPetState(newState);
      await savePetState(newState);

      // 死亡時にアラートを表示
      if (shouldDie && petState.isAlive) {
        Alert.alert('ペットが死亡しました', '健康パラメータが限界に達しました...');
      }
    },
    [petState, savePetState, checkDeathCondition]
  );

  // =====================================
  // 5. 餌やり（lastFedDateを更新）
  // =====================================
  const feedPet = useCallback(async () => {
    const newState: PetState = {
      ...petState,
      lastFedDate: new Date(),
    };
    setPetState(newState);
    await savePetState(newState);
  }, [petState, savePetState]);

  // =====================================
  // 6. 機嫌を変更
  // =====================================
  const setMood = useCallback(
    async (mood: PetState['mood']) => {
      const newState: PetState = { ...petState, mood };
      setPetState(newState);
      await savePetState(newState);
    },
    [petState, savePetState]
  );

  // =====================================
  // 7. 症状を設定
  // =====================================
  const setActiveSymptom = useCallback(
    async (symptom: Symptom | null) => {
      const newState: PetState = { ...petState, activeSymptom: symptom };
      setPetState(newState);
      await savePetState(newState);
    },
    [petState, savePetState]
  );

  // =====================================
  // 8. 危険度レベルを変更
  // =====================================
  const setDeathRiskLevel = useCallback(
    async (level: DeathRiskLevel) => {
      const newState: PetState = { ...petState, deathRiskLevel: level };
      setPetState(newState);
      await savePetState(newState);
    },
    [petState, savePetState]
  );

  // =====================================
  // 9. ペットを死亡させる
  // =====================================
  const killPet = useCallback(async () => {
    const newState: PetState = {
      ...petState,
      isAlive: false,
      mood: 'sick',
    };
    setPetState(newState);
    await savePetState(newState);
  }, [petState, savePetState]);

  // =====================================
  // 10. ペットを復活させる（リセット）
  // =====================================
  const revivePet = useCallback(async () => {
    const newState = createInitialPetState();
    setPetState(newState);
    await savePetState(newState);
  }, [savePetState]);

  return {
    // 状態
    petState,
    isLoading,

    // 計算値
    survivalDays: getSurvivalDays(),

    // 更新関数
    updateStats,
    feedPet,
    setMood,
    setActiveSymptom,
    setDeathRiskLevel,
    killPet,
    revivePet,
  };
};
