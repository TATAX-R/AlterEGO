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
      <View style={styles.petHeader}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Your Pet Name</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.editButton}>
            <MaterialIcons name="edit" size={16} color="#888" />
          </TouchableOpacity>
        </View>
        <Text style={styles.petNameText}>{petName}</Text>
      </View>

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
    paddingTop: 60,
  },
  petHeader: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
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
