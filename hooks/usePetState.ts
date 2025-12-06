// hooks/usePetState.ts
import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PetState, HealthStats, DeathRiskLevel, DiseaseType, Symptom } from '@/types/index';
import { diseaseData } from '@/constants/diseases';

const STORAGE_KEY = 'pet_state_data';

// 機嫌判定の閾値
const HAPPY_THRESHOLD = 30; // この値未満ならhappy

// 危険度レベル判定の閾値
const DANGER_THRESHOLD = 95; // この値以上でdanger（死亡判定ラインに近い）

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
          // Date型に復元し、バリデーション
          const birthDate = new Date(parsed.birthDate);
          const lastFedDate = new Date(parsed.lastFedDate);
          if (isNaN(birthDate.getTime()) || isNaN(lastFedDate.getTime())) {
            console.error('Invalid date in stored data, using initial state');
            setPetState(createInitialPetState());
            return;
          }
          const restored: PetState = {
            ...parsed,
            birthDate,
            lastFedDate,
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
  // 2.5. petStateが変化したときに自動保存
  // =====================================
  useEffect(() => {
    if (!isLoading) {
      savePetState(petState);
    }
  }, [petState, isLoading, savePetState]);

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
  // 4. 健康パラメータを更新
  // =====================================
  const updateStats = useCallback(
    (changes: Partial<HealthStats>) => {
      const newStats = { ...petState.stats };

      // 各パラメータを更新（0-100の範囲に収める）
      (Object.keys(changes) as DiseaseType[]).forEach((key) => {
        const newValue = newStats[key] + (changes[key] || 0);
        newStats[key] = Math.max(0, Math.min(100, newValue));
      });

      const newState: PetState = { ...petState, stats: newStats };
      setPetState(newState);
    },
    [petState]
  );

  // =====================================
  // 5. 餌やり（lastFedDateを更新）
  // =====================================
  const feedPet = useCallback(() => {
    const newState: PetState = {
      ...petState,
      lastFedDate: new Date(),
    };
    setPetState(newState);
  }, [petState]);

  // =====================================
  // 6. 機嫌を現在のstatsから自動判定して更新
  // =====================================
  const updateMood = useCallback(() => {
    const stats = petState.stats;
    const maxStat = Math.max(...Object.values(stats));

    // 発症閾値（各病気の最小値を使用）
    const thresholds = Object.keys(stats).map((key) => diseaseData[key as DiseaseType].threshold);
    const minThreshold = Math.min(...thresholds);

    let mood: PetState['mood'];
    if (maxStat >= minThreshold) {
      // いずれかが発症閾値以上 → sick
      mood = 'sick';
    } else if (maxStat >= HAPPY_THRESHOLD) {
      // 30以上だが発症前 → normal
      mood = 'normal';
    } else {
      // 30未満 → happy
      mood = 'happy';
    }

    const newState: PetState = { ...petState, mood };
    setPetState(newState);
  }, [petState]);

  // =====================================
  // 7. 症状を閾値超えの病気からランダムに選んで設定
  // =====================================
  const updateActiveSymptom = useCallback(() => {
    const stats = petState.stats;

    // 閾値を超えている病気を収集
    const triggeredDiseases = (Object.keys(stats) as DiseaseType[]).filter(
      (key) => stats[key] >= diseaseData[key].threshold
    );

    let symptom: Symptom | null = null;

    if (triggeredDiseases.length > 0) {
      // ランダムに1つの病気を選択
      const randomDisease = triggeredDiseases[Math.floor(Math.random() * triggeredDiseases.length)];
      const symptoms = diseaseData[randomDisease].symptoms;

      if (symptoms.length > 0) {
        // その病気の症状からランダムに1つ選択
        symptom = symptoms[Math.floor(Math.random() * symptoms.length)];
      }
    }

    const newState: PetState = { ...petState, activeSymptom: symptom };
    setPetState(newState);
  }, [petState]);

  // =====================================
  // 8. 危険度レベルを現在のstatsから自動判定して更新
  // いずれかの病気が発症（threshold以上）していればwarning
  // いずれかがDANGER_THRESHOLD以上であればdanger
  // =====================================
  const updateDeathRiskLevel = useCallback(() => {
    const { stats } = petState;
    const diseaseTypes = Object.keys(stats) as DiseaseType[];

    // danger判定: いずれかのパラメータがDANGER_THRESHOLD以上
    const hasDanger = diseaseTypes.some((disease) => stats[disease] >= DANGER_THRESHOLD);

    // warning判定: いずれかの病気が発症中（その病気のthreshold以上）
    const hasOnset = diseaseTypes.some(
      (disease) => stats[disease] >= diseaseData[disease].threshold
    );

    let level: DeathRiskLevel;
    if (hasDanger) {
      level = 'danger';
    } else if (hasOnset) {
      level = 'warning';
    } else {
      level = 'safe';
    }

    const newState: PetState = { ...petState, deathRiskLevel: level };
    setPetState(newState);
  }, [petState]);

  // =====================================
  // 9. ペットを死亡させる
  // =====================================
  const killPet = useCallback(() => {
    const newState: PetState = {
      ...petState,
      isAlive: false,
      mood: 'sick',
    };
    setPetState(newState);
  }, [petState]);

  // =====================================
  // 10. ペットを復活させる（リセット）
  // =====================================
  const revivePet = useCallback(() => {
    const newState = createInitialPetState();
    setPetState(newState);
  }, []);

  return {
    // 状態
    petState,
    isLoading,

    // 計算値
    survivalDays: getSurvivalDays(),

    // 更新関数
    updateStats,
    feedPet,
    updateMood,
    updateActiveSymptom,
    updateDeathRiskLevel,
    killPet,
    revivePet,
  };
};

// =====================================
// Context Provider
// =====================================
type PetStateContextType = ReturnType<typeof usePetState>;

const PetStateContext = createContext<PetStateContextType | null>(null);

export const PetStateProvider = ({ children }: { children: ReactNode }) => {
  const petState = usePetState();
  return React.createElement(PetStateContext.Provider, { value: petState }, children);
};

export const usePetStateContext = () => {
  const context = useContext(PetStateContext);
  if (!context) {
    throw new Error('usePetStateContext must be used within PetStateProvider');
  }
  return context;
};
