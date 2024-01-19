import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ScannedCoinInfo = ({ route }: { route: any }) => {
  const { coinData } = route.params;

  return (
    <View style={styles.container}>
      <Text>Coin Information:</Text>
      {/* Display coin data here. Example: */}
      <Text>{coinData.value}</Text>
      {/* Add more fields as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Add more styles as needed
});

export default ScannedCoinInfo;
