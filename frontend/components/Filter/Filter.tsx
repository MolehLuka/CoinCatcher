import axios from "axios";
import * as React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { ICoin } from "../../moduls/ICoin";

export default function Filter({ url }: { url: string }) {
  const [categoryOptions, setCategoryOptions] = React.useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = React.useState<string>("");
  const [categoryFilters, setCategoryFilters] = React.useState<string[]>([]);
  const [selectedValue, setSelectedValue] = React.useState<string>("");
  const [coins, setCoins] = React.useState([]);
  const [first, setFirst] = React.useState<boolean>(true);

  const placeholderCategory = {
    label: "Select a category...",
    value: null,
  };
  const placeholderValue = {
    label: "Select a value...",
    value: null,
  };

  React.useEffect(() => {
    axios
      .get(`${url}/categories`)
      .then((response) => {
        setCategoryOptions(response.data);
      })
      .catch((error) => {
        console.log("Error:", error.message);
      });
    axios
    .get(`${url}/allCoins`)
    .then((response) => {
      setCoins(response.data);
        setFirst(false);
    })
    .catch((error) => {
      console.log("Error:", error.message);
    });
  }, []);

  React.useEffect(() => {
    // Fetch all coins when 'All' is selected
    if (selectedFilter === 'All') {
      axios.get(`${url}/allCoins`)
        .then(response => {
          setCoins(response.data);
          setCategoryFilters([]); // Reset category filters
        })
        .catch(error => {
          console.log('Error:', error.message);
        });
    }
    // Fetch filter options for a specific category
    else if (selectedFilter) {
      axios.get(`${url}/filter/${selectedFilter}`)
        .then(response => {
          setCategoryFilters(response.data);
        })
        .catch(error => {
          console.log('Error:', error.message);
        });
    }
  }, [selectedFilter]);

  React.useEffect(() => {
    if (selectedValue) {
      axios
        .get(`${url}/filter/${selectedFilter}/${selectedValue}`)
        .then((response) => {
          setCoins(response.data);
        })
        .catch((error) => {
          console.log("Error:", error.message);
        });
    }
  }, [selectedValue, selectedFilter]);

  return (
    <View style={styles.row}>
      <View style={styles.big_box}>
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
        {selectedFilter && selectedFilter!=='All' && (
          <View style={styles.big_box}>
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

        {(selectedFilter === "All" || first) && (
          <ScrollView>
            {coins.map((coin: ICoin, index) => (
              <View key={index} style={styles.row}>
                <Text>{coin.value}</Text>
                <Text>{coin.currency}</Text>
                <Text>{coin.issuer}</Text>
                <Text>{coin.years}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        {selectedValue && (
          <ScrollView>
            {coins.map((coin: ICoin, index) => (
              <View key={index} style={styles.row}>
                <Text>{coin.value}</Text>
                <Text>{coin.currency}</Text>
                <Text>{coin.issuer}</Text>
                <Text>{coin.years}</Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
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
});
