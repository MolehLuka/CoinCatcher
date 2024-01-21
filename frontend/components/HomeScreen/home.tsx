import * as React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Coin from '../Coin/Coin';
import Filter from '../Filter/Filter';

export default function HomeScreen() {
  const url = "http://192.168.1.5:3000";

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={[]}>Home Screen</Text>
      <Filter url={url}/>
      {/* <Coin url={url}/> */}
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:10,
    //backgroundColor: '#1A1A1A',
    alignItems: 'center',
  },
  white_text: {
    //color: 'white',
  }
});