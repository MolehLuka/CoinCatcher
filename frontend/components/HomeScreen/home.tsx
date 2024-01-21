import axios from 'axios';
import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';
import Filter from '../Filter/Filter';


export default function HomeScreen() {

  const url = "http://192.168.1.5:3000";

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={[]}>Home Screen</Text>
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