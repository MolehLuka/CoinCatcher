import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/coin-flip-loading.gif")}
        style={styles.image}
      />
      <Text style={styles.overlayText}>CoinCatcher</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up all screen
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#242424", // or any background color you prefer
  },
  image: {
    width: 600, // Set as needed
    height: 800, // Set as needed
  },
  overlayText: {
    position: "absolute",
    top: "10%",
    textAlign: "center",
    width: "100%",
    color: "#FFA500",
    fontSize: 50,
    fontWeight: "bold",
    textShadowColor: "white", // Outline (stroke) color
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
});

export default LoadingScreen;
