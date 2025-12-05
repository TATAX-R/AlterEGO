// components/Pet/PetNameEditModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

type Props = {
  visible: boolean;
  currentName: string;
  onClose: () => void;
  onSave: (newName: string) => void;
};

export const PetNameEditModal = ({ visible, currentName, onClose, onSave }: Props) => {
  const [name, setName] = useState(currentName);

  // モーダルが開くたびに、今の名前をセット
  useEffect(() => {
    if (visible) {
      setName(currentName);
    }
  }, [visible, currentName]);

  const handleSave = () => {
    onSave(name);
    onClose();
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>名前を変更</Text>

          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="新しい名前を入力"
            maxLength={8}
            autoFocus
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.buttonCancel]} onPress={onClose}>
              <Text style={styles.textCancel}>キャンセル</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.buttonSave]} onPress={handleSave}>
              <Text style={styles.textSave}>保存</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    fontSize: 18,
    padding: 10,
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 10,
    padding: 12,
    width: '45%',
    alignItems: 'center',
  },
  buttonCancel: { backgroundColor: '#f5f5f5' },
  buttonSave: { backgroundColor: '#007AFF' },
  textCancel: { color: '#666', fontWeight: 'bold' },
  textSave: { color: 'white', fontWeight: 'bold' },
});
