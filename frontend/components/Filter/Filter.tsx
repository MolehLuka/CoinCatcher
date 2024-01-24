import axios from "axios";
import * as React from "react";
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import CoinItem from "./CoinItem";
import { baseUrl } from "../../global";
import CoinModal from "./CoinModal";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MyCoin } from "../Trznica/trznica";



interface FilterProps {
  dataChange: MyCoin | null,
  navigation: NativeStackNavigationProp<any>;
}

export default function Filter({dataChange}: FilterProps) {
  const [categoryOptions, setCategoryOptions] = React.useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = React.useState<string>("");
  const [categoryFilters, setCategoryFilters] = React.useState<string[]>([]);
  const [selectedValue, setSelectedValue] = React.useState<string>("");
  const [coinData, setCoinData] = React.useState<MyCoin[]>([]);
  const [filteredCoins, setFilteredCoins] = React.useState<MyCoin[]>(coinData);
  const [selectedCoin, setSelectedCoin] = React.useState<MyCoin|null>(null);

  const placeholderCategory = {
    label: "Select a category...",
    value: "vsi",
  };
  const placeholderValue = {
    label: "Select a value...",
    value: null,
  };

  if(coinData == null){
    return;
  }

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
            slika: 'https://as2.ftcdn.net/v2/jpg/03/16/24/49/1000_F_316244961_4Kch7qlXUf8accn4wXUK4vA4ZfPMmpPh.jpg',
            telefonskaSt: document.data.telefonskaSt,
            datum: document.data.datum,
            imepriimek: document.data.imepriimek,
            cena: document.data.cena
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
  }, [dataChange]);

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
      console.log(filterValues)
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

  const openModal = (coin: MyCoin) => {
    setSelectedCoin(coin);
  };

  const closeModal = () => {
    setSelectedCoin(null);
  };

  return (
    <View style={[styles.flex]}>
      <View style={[styles.pickerContainer, styles.filterContainer]}>
        <Text style={[styles.pickerLabel]}>Select a category</Text>
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
          style={pickerSelectStyles}
        />
        {selectedFilter && selectedFilter !== "vsi" && (
          <View style={[styles.pickerContainer]}>
            <Text style={[styles.pickerLabel]}>Izberite vrednost</Text>
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
              style={pickerSelectStyles}
            />
          </View>
        )}
      </View>
      {selectedFilter === "vsi" && (
        
        <FlatList
        data={coinData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
          onPress={() => openModal(item)}>
            <CoinItem coin={item} />
          </TouchableOpacity>
        )}
      />
      )}
      {selectedValue && (
          <FlatList
          data={filteredCoins}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
            onPress={() => openModal(item)}>
              <CoinItem coin={item} />
            </TouchableOpacity>
          )}
        />
        )}

<CoinModal
        visible={selectedCoin !== null}
        onClose={closeModal}
        coin={selectedCoin}
      />
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
  },
  filterContainer: {
    backgroundColor: '#fff',
    marginTop: 15,
    padding: 10,
    borderRadius: 10,
  },
  pickerContainer: {
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
