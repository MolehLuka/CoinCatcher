import React, { useRef } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Image, TouchableOpacity } from "react-native";
import Coin from "../Coin/Coin";
import CurrencyConverter from "../Coin/CurrencyConverter/CurrencyConverter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { baseUrl } from "../../global";
import { useState, useEffect } from "react";
import DropdownAlert, {
  DropdownAlertData,
  DropdownAlertType,
} from "react-native-dropdownalert";

interface Coin {
  composition: string;
  currency: string;
  diameter: string;
  id: number;
  images: {
    back: string;
    front: string;
  };
  issuer: string;
  obverse: string;
  reverse: string;
  shape: string;
  thickness: string;
  value: string;
  weight: string;
  years: string;
}


const ClickedCoinInfo = ({ coin }: { coin: Coin }) => {
  const [coinData, setCoinData] = useState<Coin>(coin);

  return (
    <ScrollView style={styles.container}>
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

        <View>
        <CurrencyConverter coin={coinData} />
        </View>

        <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Material</Text>
        <Text style={styles.infoText}>{coinData.composition}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Front</Text>
        <Text style={styles.infoText}>{coinData.obverse}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Back</Text>
        <Text style={styles.infoText}>{coinData.reverse}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Coin Details</Text>
        <View style={styles.row}>
          <View style={styles.col}>
          <Text style={styles.infoText}>Shape: {coinData.shape}</Text>
          </View>
          <View style={[styles.col, {marginRight: 0}]}>
            <Text style={styles.infoText}>Diameter: {coinData.diameter}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.infoText}>Thickness: {coinData.thickness}</Text>
          </View>
          <View style={[styles.col, {marginRight: 0}]}>
          <Text style={styles.infoText}>Weight: {coinData.weight}</Text>
          </View>
        </View>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    //justifyContent: "space-between",
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
    // position: "absolute", // Position over everything else
    // right: 20, // 20 points from the right edge of the screen
    // bottom: 20, // 20 points from the bottom edge of the screen
    backgroundColor: "#FFA500", // Orange color
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
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
  detailText: {
    fontSize: 14,
    color: "gray",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10, // Adjust as needed
  },
  boldText: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20, // Adjust as needed
  },
  infoContainer: {
    backgroundColor: '#edebe6', // Light grey background for the info sections
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333', // Darker text for the title
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'justify', // For better readability of longer texts
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  col: {
    flex: 1,
  },
});

export default ClickedCoinInfo;
