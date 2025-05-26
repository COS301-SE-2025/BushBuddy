import { StyleSheet, Text, View } from 'react-native';


export default function CameraPage() {
  return (
    <View style={styles.container}>
      <Text>Camera Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});