import React, { useId, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableHighlight } from "react-native";
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
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

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

interface ClickedCoinInterface{
  route: any;
  navigation: NativeStackNavigationProp<any>;
}

function ClickedCoinInfo ({route,navigation}: ClickedCoinInterface) {
    const { coin } = route.params;
  const [coinData, setCoinData] = useState<Coin>(coin);
  const [uid, setUid] = useState<string | null>("");

  const [frontImageLoading, setFrontImageLoading] = useState(true);
  const [backImageLoading, setBackImageLoading] = useState(true);

  useEffect(() => {
    const fetchUid = async () => {
      const value = await AsyncStorage.getItem("id");
      setUid(value);
      console.log(value);
    };

    fetchUid();
  }, []);


  const handelRemoveCoin = (id: number) => {
    axios.delete(`${baseUrl}/removeCoin/${id}/${uid}`)
      .then(response => {
        console.log(`Item with id ${id} removed successfully`);
        console.log('route.params:', route.params);
        console.log('navigation:', navigation);
        console.log(response)
        navigation.goBack()
        
      })
      .catch(error => {
        console.error(`Error removing item with id ${id}:`, error);
      });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        { frontImageLoading && <PulseIndicator color="#FFA500" size={100} style={styles.activityIndicator} /> }
        <Image
          source={{ uri: coinData.images.front }}
          style={styles.coinImage}
          onLoad={() => setFrontImageLoading(false)}
        />
        { backImageLoading && <PulseIndicator color="#FFA500" size={100} style={styles.activityIndicator}/> }
        <Image
          source={{ uri: coinData.images.back }}
          style={styles.coinImage}
          onLoad={() => setBackImageLoading(false)}
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
        <Text style={styles.infoText}>{coinData.reverse}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Back</Text>
        <Text style={styles.infoText}>{coinData.obverse}</Text>
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
      <TouchableHighlight
  style={[styles.button, styles.centeredButton]}
  underlayColor="#3D8B3D"
  onPress={() => handelRemoveCoin(coinData.id)}
>
  <Text style={styles.buttonText}>Remove coin</Text>
</TouchableHighlight>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    //justifyContent: "space-between",
    backgroundColor: "white",
    paddingBottom: 50,

    
  },
 
  centeredButton: {
    alignSelf: 'center',
    marginBottom:30
  },
  button: {
    backgroundColor: "#FFA500", // Set the background color
    padding: 10, // Adjust padding as needed
    borderRadius: 8, // Add border radius for rounded corners
    justifyContent: "center", // Center text vertically
    alignItems: "center", // Center text horizontally
    elevation: 3, // Add elevation for a shadow effect (Android)
    shadowColor: "#000000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow for iOS
    shadowOpacity: 0.3, // Shadow for iOS
    shadowRadius: 2, // Shadow for iOS
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
    marginBottom: 30
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
  activityIndicator: {
    position: "absolute",
    alignSelf: "center",
    zIndex: 1,
  },
});

export default ClickedCoinInfo;
