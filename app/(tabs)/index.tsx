import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { usePetName } from '@/hooks/usePetName';
import { PetNameEditModal } from '@/components/PetName/PetNameEditModal';

export default function Index() {
  const { petName, updatePetName } = usePetName();
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* 2. ペット名表示部分（ここを好みのデザインに変更） */}
      <View style={styles.petHeader}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Your Pet Name</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.editButton}>
            <MaterialIcons name="edit" size={16} color="#888" />
          </TouchableOpacity>
        </View>
        <Text style={styles.petNameText}>{petName}</Text>
      </View>

      {/* 3. コンテンツの他の部分がここに来ます */}
      {/* <Link href="/details" ... /> など */}

      {/* 4. モーダル本体（通常は最下部に配置） */}
      <PetNameEditModal
        visible={isModalVisible}
        currentName={petName}
        onClose={() => setModalVisible(false)}
        onSave={(newName) => updatePetName(newName)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    // justifyContent: 'center', // 画面構成に合わせて調整
    paddingTop: 60, // SafeAreaViewがない場合の余白
  },
  petHeader: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20, // 下のコンテンツとの余白
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  label: {
    fontSize: 12,
    color: '#888',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  petNameText: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  editButton: { padding: 4 },
});
