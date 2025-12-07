// app/(tabs)/Pet-debug/index.tsx
// ペット状態のデバッグ用ページ
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePetStateContext } from '@/hooks/usePetState';
import { DiseaseType } from '@/types/index';

const STORAGE_KEY = 'pet_state_data';

export default function PetDebugScreen() {
  const {
    petState,
    isLoading,
    survivalDays,
    updateStats,
    feedPet,
    updateMood,
    updateActiveSymptom,
    updateDeathRiskLevel,
    killPet,
    revivePet,
    setBirthDate, // 日数を代入するために必要
  } = usePetStateContext();

  const [rawStorageData, setRawStorageData] = useState<string>('');
  const [daysInput, setDaysInput] = useState<string>(''); // 日数入力用

  // AsyncStorageの生データを取得
  const fetchRawStorage = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      setRawStorageData(data ? JSON.stringify(JSON.parse(data), null, 2) : '(empty)');
    } catch (e) {
      setRawStorageData('Error: ' + String(e));
    }
  };

  useEffect(() => {
    fetchRawStorage();
  }, [petState]);

  // パラメータを増減するボタン
  const handleStatChange = (disease: DiseaseType, amount: number) => {
    updateStats({ [disease]: amount });
  };

  // 全パラメータをリセット
  const handleResetStats = () => {
    updateStats({
      obesity: -100,
      diabetes: -100,
      hypertension: -100,
      dyslipidemia: -100,
      gout: -100,
    });
  };

  // 全パラメータを危険値に
  const handleMaxStats = () => {
    updateStats({
      obesity: 100,
      diabetes: 100,
      hypertension: 100,
      dyslipidemia: 100,
      gout: 100,
    });
  };

  // 日数を代入する
  const handleSetDays = () => {
    const days = parseInt(daysInput, 10);
    if (isNaN(days) || days < 0) {
      Alert.alert('エラー', '有効な日数を入力してください');
      return;
    }
    // 日数からbirthDateを逆算
    const now = new Date();
    const newBirthDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    if (setBirthDate) {
      setBirthDate(newBirthDate);
      Alert.alert('成功', `生存日数を${days}日に設定しました`);
      setDaysInput('');
    } else {
      Alert.alert('エラー', 'setBirthDate関数が利用できません');
    }
  };

  // AsyncStorageを完全クリア
  const handleClearStorage = async () => {
    Alert.alert(
      'データ削除',
      'AsyncStorageのペットデータを完全に削除しますか？\nアプリを再起動すると初期状態になります。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem(STORAGE_KEY);
            Alert.alert('削除完了', 'アプリを再起動してください');
            fetchRawStorage();
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>読み込み中...</Text>
      </View>
    );
  }

  const diseases: { key: DiseaseType; label: string }[] = [
    { key: 'obesity', label: '肥満' },
    { key: 'diabetes', label: '糖尿病' },
    { key: 'hypertension', label: '高血圧' },
    { key: 'dyslipidemia', label: '脂質異常症' },
    { key: 'gout', label: '痛風' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🐷 ペット状態デバッグ</Text>

      {/* 基本情報 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>基本情報</Text>
        <Text style={styles.infoText}>生存日数: {survivalDays}日目</Text>
        <Text style={styles.infoText}>生存状態: {petState.isAlive ? '🟢 生存' : '💀 死亡'}</Text>
        <Text style={styles.infoText}>機嫌: {petState.mood}</Text>
        <Text style={styles.infoText}>危険度: {petState.deathRiskLevel}</Text>
        <Text style={styles.infoText}>
          症状: {petState.activeSymptom ? petState.activeSymptom.text : '(なし)'}
        </Text>
        <Text style={styles.infoText}>誕生日: {petState.birthDate.toLocaleString()}</Text>
        <Text style={styles.infoText}>最終食事: {petState.lastFedDate.toLocaleString()}</Text>
      </View>

      {/* 日数を代入 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>生存日数を設定（代入）</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={daysInput}
            onChangeText={setDaysInput}
            placeholder="日数を入力"
            keyboardType="number-pad"
          />
          <TouchableOpacity style={styles.actionButton} onPress={handleSetDays}>
            <Text style={styles.actionButtonText}>日数を設定</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 健康パラメータ */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>健康パラメータ (0-100)</Text>
        {diseases.map(({ key, label }) => (
          <View key={key} style={styles.statRow}>
            <Text style={styles.statLabel}>
              {label}: {petState.stats[key]}
            </Text>
            <View style={styles.statButtons}>
              <TouchableOpacity
                style={[styles.smallButton, styles.minusButton]}
                onPress={() => handleStatChange(key, -10)}>
                <Text style={styles.buttonText}>-10</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallButton, styles.plusButton]}
                onPress={() => handleStatChange(key, 10)}>
                <Text style={styles.buttonText}>+10</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallButton, styles.plusButton]}
                onPress={() => handleStatChange(key, 30)}>
                <Text style={styles.buttonText}>+30</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* 自動判定関数 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>自動判定を実行</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.actionButton} onPress={updateMood}>
            <Text style={styles.actionButtonText}>updateMood</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={updateActiveSymptom}>
            <Text style={styles.actionButtonText}>updateActiveSymptom</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.actionButton} onPress={updateDeathRiskLevel}>
            <Text style={styles.actionButtonText}>updateDeathRiskLevel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={feedPet}>
            <Text style={styles.actionButtonText}>feedPet</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* クイックアクション */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>クイックアクション</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.resetButton]}
            onPress={handleResetStats}>
            <Text style={styles.actionButtonText}>パラメータ0に</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.dangerButton]}
            onPress={handleMaxStats}>
            <Text style={styles.actionButtonText}>パラメータMAX</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.actionButton, styles.dangerButton]} onPress={killPet}>
            <Text style={styles.actionButtonText}>killPet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.resetButton]} onPress={revivePet}>
            <Text style={styles.actionButtonText}>revivePet</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* AsyncStorage生データ */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AsyncStorage 生データ</Text>
        <TouchableOpacity style={styles.actionButton} onPress={fetchRawStorage}>
          <Text style={styles.actionButtonText}>再取得</Text>
        </TouchableOpacity>
        <Text style={styles.rawData}>{rawStorageData}</Text>
        <TouchableOpacity
          style={[styles.actionButton, styles.dangerButton, { marginTop: 10 }]}
          onPress={handleClearStorage}>
          <Text style={styles.actionButtonText}>AsyncStorageを削除</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#555',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    width: 120,
    color: '#333',
  },
  statButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  smallButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  minusButton: {
    backgroundColor: '#4CAF50',
  },
  plusButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 140,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#4CAF50',
  },
  dangerButton: {
    backgroundColor: '#f44336',
  },
  rawData: {
    fontFamily: 'monospace',
    fontSize: 10,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
  },
});
