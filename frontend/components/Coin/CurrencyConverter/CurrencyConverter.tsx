import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { ICoin } from "../../../moduls/ICoin";

export default function CurrencyConverter({ coin }: { coin: ICoin }) {
  const [eurConversion, setEurConversion] = React.useState<Number>(0);
  const [usdConversion, setUsdConversion] = React.useState<Number>(0);
  const [gbpConversion, setGbpConversion] = React.useState<Number>(0);
  const [currencies, setCurrencies] = React.useState<{ [key: string]: number }>({});
  const [selectedCurrency, setSelectedCurrency] = React.useState<{
    key: string;
    value: number;
  }>({ key: "", value: 0 });

  const api_base_url = `https://api.frankfurter.app/latest?amount=${coin.value}&from=${coin.currency}`;

  React.useEffect(() => {
    fetchApiAuto();
  }, [coin.value, coin.currency]);

  const placeholder = {
    label: "Select an option...",
    value: null,
  };

  const fetchApiAuto = async () => {
    try {
      const response = await fetch(urlString("USD,GBP"));
      const res = await response.json();
      console.log(res)
      const responseConversions = await fetch(api_base_url);
      const resConversions = await responseConversions.json();
      setEurConversion(Number(res.amount));
      setUsdConversion(Number(res.rates["USD"]));
      setGbpConversion(Number(res.rates["GBP"]));
      setCurrencies(resConversions.rates);
    } catch (error) {
      console.log(error);
    }
  };

  const urlString = (to: string) => {
    return api_base_url + `&to=${to}`;
  };

  const currencyItems = Object.keys(currencies).map((key) => ({
    label: key,
    value: key,
  }));

  return (
    <View style={[styles.container]}>
      <View style={[styles.row, styles.box, styles.bg_gray]}>
        <View style={[styles.col, styles.box]}>
          <Text style={[styles.white_text]}>{eurConversion.toFixed(2)}</Text>
          <Text style={[styles.country_text]}>EUR</Text>
        </View>
        <View style={[styles.col, styles.box]}>
          <Text style={[styles.white_text]}>{usdConversion.toFixed(3)}</Text>
          <Text style={[styles.country_text]}>USD</Text>
        </View>
        <View style={[styles.col, styles.box]}>
          <Text style={[styles.white_text]}>{gbpConversion.toFixed(3)}</Text>
          <Text style={[styles.country_text]}>GBP</Text>
        </View>
      </View>


      <View style={[styles.big_box, styles.bg_black]}>
        <Text style={[styles.bg_black, styles.white_text]}>Currency Converter</Text>
        <RNPickerSelect
          placeholder={placeholder}
          items={currencyItems}
          onValueChange={(key: string) => {
            setSelectedCurrency({ key, value: currencies[key] })
          }
          }
          value={selectedCurrency?.key}
        />
        {selectedCurrency?.key && <Text style={[styles.box, styles.white_text]}>{selectedCurrency.value}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    color: "white",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  col: {
    flex: 1,
    marginHorizontal: 5,
  },
  box: {
    //borderWidth: 1,
    padding: 10,
    margin: 5,
    //borderColor: "gray", // And this line
    borderRadius: 10,
    alignItems: "center",
  },
  big_box: {
    //borderWidth: 1,
    padding: 10,
    margin: 5,
    //borderColor: "gray", // And this line
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  bg_gray: {
    //backgroundColor: "#1F1F21",
    //color: "white",
  },
  bg_black: {
    //backgroundColor: "black",
    //color: "white",
  },
  white_text: {
    //color: "#CFCDC7",
    fontWeight: "bold",
  },
  country_text: {
    //color: '#5D5A4F',
    fontWeight: 'bold',
  }
});
