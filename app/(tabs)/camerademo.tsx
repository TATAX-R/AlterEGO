import { Text, View, StyleSheet } from 'react-native';

export default function CameraDemo() {
  return (
    <View>
      <Text style={styles.text}>test only</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#fff',
    marginTop: 500,
  },
});
