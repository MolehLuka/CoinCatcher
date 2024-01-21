import axios from "axios";
import * as React from "react";
import { View, Text, StyleSheet, ScrollView, FlatList } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import CoinItem from "./CoinItem";
import { baseUrl } from "../../global";

interface MyCoin {
  id: string;
  data: {
    ime: string;
    kolicina: string;
    opis: string;
    slika: string;
  };
}

export default function Filter() {
  const [categoryOptions, setCategoryOptions] = React.useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = React.useState<string>("");
  const [categoryFilters, setCategoryFilters] = React.useState<string[]>([]);
  const [selectedValue, setSelectedValue] = React.useState<string>("");
  const [coinData, setCoinData] = React.useState<MyCoin[]>([]);
  const [filteredCoins, setFilteredCoins] = React.useState<MyCoin[]>(coinData);

  const placeholderCategory = {
    label: "Select a category...",
    value: "vsi",
  };
  const placeholderValue = {
    label: "Select a value...",
    value: null,
  };

  React.useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/pridobiKovanceTrznica`);
        const documents = response.data.documents;

        const newCoinData: MyCoin[] = documents.map((document: any) => ({
          id: document.id,
          data: {
            ime: document.data.ime,
            kolicina: document.data.kolicina,
            opis: document.data.opis,
            slika: document.data.slika,
          },
        }));

        setCoinData(newCoinData);
      } catch (error) {
        console.error(
          "Napaka pri pridobivanju podatkov o kriptovalutah",
          error
        );
      }
    };

    fetchCoinData();
  }, []);

  React.useEffect(() => {
    axios
      .get(`${baseUrl}/categories`)
      .then((response) => {
        setCategoryOptions(response.data);
      })
      .catch((error) => {
        console.log("Error:", error.message);
      });
  }, []);

  React.useEffect(() => {
    type CoinDataKey = "ime" | "kolicina" | "opis";
    if (selectedFilter && coinData.length > 0) {
      const filterValues = Array.from(
        new Set(
          coinData.map(
            (coin: MyCoin) => coin.data[selectedFilter as CoinDataKey]
          )
        )
      );
      setCategoryFilters(filterValues);
    }
  }, [selectedFilter, coinData]);

  React.useEffect(() => {
    type CoinDataKey = "ime" | "kolicina" | "opis";
    if (selectedValue && selectedFilter && coinData.length > 0) {
      const filteredCoins = coinData.filter(
        (coin: MyCoin) =>
          coin.data[selectedFilter as CoinDataKey] === selectedValue
      );
      setFilteredCoins(filteredCoins);
    }
  }, [selectedValue, selectedFilter, coinData]);

  return (
    <View style={[styles.flex]}>
      <View style={[]}>
        <Text>Filter</Text>
        <RNPickerSelect
          placeholder={placeholderCategory}
          items={categoryOptions.map((category) => ({
            label: category,
            value: category,
          }))}
          onValueChange={(filter: string) => {
            setSelectedFilter(filter);
            setSelectedValue("");
          }}
          value={selectedFilter}
        />
        {selectedFilter && selectedFilter !== "vsi" && (
          <View style={[]}>
            <RNPickerSelect
              placeholder={placeholderValue}
              items={categoryFilters.map((category) => ({
                label: category,
                value: category,
              }))}
              onValueChange={(value: string) => {
                setSelectedValue(value);
              }}
              value={selectedValue}
            />
          </View>
        )}
      </View>
      {selectedFilter === "vsi" && (
                  <FlatList
                  data={coinData}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => <CoinItem coin={item} />}
                />
      )}
      {selectedValue && (
          <FlatList
            data={filteredCoins}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CoinItem coin={item} />}
          />
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
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
  flex: {
    flex: 1,
  }
});
