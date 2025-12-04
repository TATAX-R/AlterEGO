// components/StepCounter/StepUnavailableNotice.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const StepUnavailableNotice = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🚫</Text>
      <Text style={styles.title}>ご利用いただけません</Text>
      <Text style={styles.message}>Androidユーザーの方はExpo Goでこの機能はご利用いただけません</Text>
      <Text style={styles.subMessage}>展示中のiOSアプリでお試しください</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  icon: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  subMessage: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 12,
  },
});
