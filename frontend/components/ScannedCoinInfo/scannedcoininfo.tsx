import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image, TouchableOpacity } from "react-native";
import Coin from "../Coin/Coin";
import CurrencyConverter from "../Coin/CurrencyConverter/CurrencyConverter";

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

      <CurrencyConverter coin={coinData} />

      <TouchableOpacity style={styles.addToCollectionButton}>
        <Text style={styles.addToCollectionButtonText}>
          + Add to Collection
        </Text>
      </TouchableOpacity>
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
  addToCollectionButton: {
    position: "absolute", // Position over everything else
    right: 20, // 20 points from the right edge of the screen
    bottom: 20, // 20 points from the bottom edge of the screen
    backgroundColor: "#FFA500", // Orange color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 3, // Add elevation for Android shadow
    shadowColor: "#000000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow for iOS
    shadowOpacity: 0.3, // Shadow for iOS
    shadowRadius: 2, // Shadow for iOS
  },
  addToCollectionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Add more styles as needed
});

export default ScannedCoinInfo;
