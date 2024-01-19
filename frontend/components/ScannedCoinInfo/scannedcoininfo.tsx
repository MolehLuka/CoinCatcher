import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "react-native";

const ScannedCoinInfo = ({ route }: { route: any }) => {
  const { coinData } = route.params;
  //const serverBaseUrl = 'http://192.168.1.107:3000';

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: coinData.images.front }}
          style={styles.coinImage}
        />
        <Image
          source={{ uri: coinData.images.back }}
          style={styles.coinImage}
        />
      </View>
      <Text
        style={styles.coinName}
      >{`${coinData.issuer} ${coinData.value}`}</Text>
      {/* ... other details ... */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  imageContainer: {
    flexDirection: "row", // This will arrange the images in a row
    justifyContent: "center", // This will center the images horizontally
    alignItems: "center", // This will center the images vertically
    marginTop: 30,
  },
  coinImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginHorizontal: 10, // Add space between the images
  },
  coinName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20, // Adjust as needed
  },
  // Add more styles as needed
});

export default ScannedCoinInfo;
