import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Button, TouchableOpacity } from 'react-native';
import { baseUrl } from '../../global';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Filter from '../Filter/Filter';
import { MyCoin } from '../Trznica/trznica';


  

  const CoinItem: React.FC<{ coin: MyCoin }> = ({ coin }) => (
    <View style={styles.coinContainer}>
       <Image source={{ uri: coin.data.slika }} style={styles.coinImage} />

      <View style={styles.coinInfo}>
        <Text style={styles.coinName}>{coin.data.ime}</Text>

      </View>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#f0f0f0',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    coinContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      
    },
    coinImage: {
      width: 120,
      height: 120,
      borderRadius: 100,
      marginRight: 12,
    },
    coinInfo: {
      flex: 1,
    },
    coinName: {
      fontSize: 18,
      marginHorizontal: 50
    },
    coinDescription: {
      fontSize: 14,
      color: '#666',
      marginBottom: 4,
    },
    coinQuantity: {
      fontSize: 16,
      color: '#333',
    },
    registerButton: {
      backgroundColor: 'gold',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 5,
      marginTop: 10,
    },
    buttonText: {
      color: "black",
      textAlign: "center",
      fontSize: 16,
    },
  });

export default CoinItem;