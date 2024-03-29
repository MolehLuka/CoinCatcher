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
import {
  PulseIndicator,
} from "react-native-indicators";


const ScannedCoinInfo = ({ route }: { route: any }) => {
  const { coinData } = route.params;

  const [frontImageLoading, setFrontImageLoading] = useState(true);
  const [backImageLoading, setBackImageLoading] = useState(true);

  //const serverBaseUrl = 'http://192.168.1.107:3000';

  const [uid, setUid] = useState<string | null>("");

  let alert = (_data: DropdownAlertData) =>
    new Promise<DropdownAlertData>((res) => res);

  useEffect(() => {
    const fetchUid = async () => {
      const value = await AsyncStorage.getItem("id");
      setUid(value);
      console.log(value);
    };

    fetchUid();
  }, []);

  const addToCollection = async () => {
    // console.log("userId: ", uid);

    try {
      const response = await axios.post(`${baseUrl}/dodajKovanecVCollection`, {
        userId: uid,
        coinData: coinData,
      });

      if (response.status === 200) {
        const alertData = await alert({
          type: DropdownAlertType.Info,
          title: "Success",
          message: "Coin added to collection.",
        });
      }
    } catch (error) {
      if ((error as any).response) {
        if ((error as any).response.status === 409) {
          const alertData = await alert({
            type: DropdownAlertType.Error,
            title: "Error",
            message: "Coin already in collection!",
          });
        } else {
          const alertData = await alert({
            type: DropdownAlertType.Error,
            title: "Error",
            message: "Error calling backend.",
          });
        }
      } else {
        const alertData = await alert({
          type: DropdownAlertType.Error,
          title: "Error",
          message: "Error calling backend.",
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {frontImageLoading && <PulseIndicator color="#FFA500" size={100} style={styles.activityIndicator} />}
        <Image
          source={{ uri: coinData.images.front }}
          style={styles.coinImage}
          onLoad={() => setFrontImageLoading(false)}
        />
        {backImageLoading && <PulseIndicator color="#FFA500" size={100} style={styles.activityIndicator} />}
        <Image
          source={{ uri: coinData.images.back }}
          style={styles.coinImage}
          onLoad={() => setBackImageLoading(false)}
        />
      </View>
      <Text
        style={styles.coinName}
      >{`${coinData.issuer} ${coinData.value}`}</Text>

      <View style={[]}>
        <TouchableOpacity style={styles.addToCollectionButton} onPress={addToCollection}>
          <Text style={styles.addToCollectionButtonText}>
            + Add to Collection
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.detailText}>
        To check detailed information about the coin, add it to a collection!
      </Text>

      <View style={[]}>
        <CurrencyConverter coin={coinData} />
      </View>

      <DropdownAlert alert={func => (alert = func)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
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
    marginVertical: 20, // Adjust as needed
  },
  row: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  activityIndicator: {
    position: "absolute",
    alignSelf: "center",
    zIndex: 1,
  },
});

export default ScannedCoinInfo;

