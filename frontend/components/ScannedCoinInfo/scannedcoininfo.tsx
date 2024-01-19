import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'react-native';

const ScannedCoinInfo = ({ route }: { route: any }) => {
  const { coinData } = route.params;
  //const serverBaseUrl = 'http://192.168.1.107:3000';

  return (
    <View style={styles.container}>
      <Text>Coin Information:</Text>
      {/* Display coin data here. Example: */}
      <Image source={{ uri: coinData.images.front}} style={styles.image} onError={(e) => console.log(e.nativeEvent.error)}/>
      <Image source={{ uri: coinData.images.back}} style={styles.image} />
      <Text>{coinData.value}</Text>
      <Text>{coinData.currency}</Text>
      <Text>{coinData.issuer}</Text>
      <Text>{coinData.years}</Text>
      <Text>{coinData.composition}</Text>
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
  image: {
    width: 150,
    height: 150, 
    resizeMode: 'contain',
  },
  // Add more styles as needed
});

export default ScannedCoinInfo;
