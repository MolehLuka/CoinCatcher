import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Button, TouchableOpacity } from 'react-native';
import { baseUrl } from '../../global';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Filter from '../Filter/Filter';

interface MyCoin {
    id: string;
    data: {
      ime: string;
      kolicina: string;
      opis: string;
      slika: string;
    };
  }
  
  
  const CoinItem: React.FC<{ coin: MyCoin }> = ({ coin }) => (
    <View style={styles.coinContainer}>
      <Image source={{ uri: coin.data.slika }} style={styles.coinImage} />
      <View style={styles.coinInfo}>
        <Text style={styles.coinName}>{coin.data.ime}</Text>
        <Text style={styles.coinDescription}>{coin.data.opis}</Text>
        <Text style={styles.coinQuantity}>Količina: {coin.data.kolicina}</Text>
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
      backgroundColor: '#fff',
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
      fontWeight: 'bold',
      marginBottom: 4,
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