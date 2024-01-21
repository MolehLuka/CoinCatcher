import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import CurrencyConverter from "./CurrencyConverter/CurrencyConverter";
import { ICoin } from "../../moduls/ICoin";

const initialCoin: ICoin = {
  id: -1,
  issuer: "",
  years: "",
  value: "",
  currency: "",
  composition: "",
  weight: "",
  diameter: "",
  thickness: "",
  obverse: "",
  reverse: "",
  images: {
    front: "",
    back: "",
  },
};

export default function Coin({url}:{url: string}) {
  const [coin, setCoin] = React.useState(initialCoin);

  React.useEffect(() => {
    fetchRandomCoin();
  }, []);

  const fetchRandomCoin = async () => {
    try {
      const response = await fetch(url + "/random-coin");
      const res = await response.json();
      setCoin(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
      <CurrencyConverter coin={coin}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:0,
    //borderWidth: 1,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  white_text: {
    //color: 'white',
  }
});