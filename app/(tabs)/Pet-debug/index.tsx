// app/(tabs)/index.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// ファイル名変更に合わせてimportを修正
import { usePetName } from '@/hooks/usePetName';
import { PetNameEditModal } from '@/components/Pet/PetNameEditModal';

export default function HomeScreen() {
  const { petName, updatePetName } = usePetName();
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* ペット表示エリア */}
      <View style={styles.petHeader}>
        <View>
          <Text style={styles.label}>Your Pet Name</Text>
          <View style={styles.nameRow}>
            {/* ここに名前を表示 */}
            <Text style={styles.petNameText}>{petName}</Text>

            {/* 編集ボタン */}
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.editButton}>
              <MaterialIcons name="edit" size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.avatarPlaceholder} />
      </View>

      {/* 名前編集モーダル */}
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
  container: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 60 },
  petHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 12,
    width: 200,
  },
  label: {
    fontSize: 10,
    color: '#888',
    marginBottom: 2,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  petNameText: { fontSize: 20, fontWeight: 'bold', color: '#333', marginRight: 8 },
  editButton: { padding: 8 },
});
