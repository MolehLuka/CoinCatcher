import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import { baseUrl } from "../../global";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Filter from "../Filter/Filter";

export interface MyCoin {
  id: string;
  data: {
    ime: string;
    kolicina: string;
    opis: string;
    slika: string;
    telefonskaSt: number,
    datum: string,
    imepriimek: string,
    cena: number
  };
}


interface RegisterProps {
  navigation: NativeStackNavigationProp<any>;
  dataChange: MyCoin | null;

}

const Trznica = ({ navigation, dataChange}: RegisterProps) => {
  const [coinData, setCoinData] = useState<MyCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = React.useState<string>("");
  const [selectedValue, setSelectedValue] = React.useState<string>("");



  function handleDodaj() {
    navigation.navigate("DodajTrznica");
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleDodaj} style={styles.registerButton}>
        <Text style={styles.buttonText}>+ Add</Text>
      </TouchableOpacity>
      <Filter dataChange={dataChange} navigation={navigation}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  coinContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  coinImage: {
    width: 120,
    height: 120,
    borderRadius: 25,
    marginRight: 12,
  },
  coinInfo: {
    flex: 1,
  },
  coinName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  coinDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  coinQuantity: {
    fontSize: 16,
    color: "#333",
  },
  registerButton: {
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
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold", 
  },
});

export default Trznica;
