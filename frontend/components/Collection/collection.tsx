// Frontend in React Native
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { baseUrl } from '../../global';
import {
  PulseIndicator,
} from "react-native-indicators";
import { useNavigation } from '@react-navigation/native';
import { ICoin } from '../../moduls/ICoin';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  CollectionScreen: undefined;
  ClickedCoinInfo: { coin: ICoin };
};

type ClickedCoinInfoRouteProp = StackNavigationProp<RootStackParamList, 'ClickedCoinInfo'>;

type Props = {
  navigation: ClickedCoinInfoRouteProp;
};

export const CollectionScreen: React.FC<Props> = ({navigation }) => {
  const [coins, setCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(false);

  const extractEuroValue = (value: string) => {
    // Try to extract value from within parentheses first
    const match = value.match(/\((\d+\.\d+) EUR\)/);
    if (match) {
      return parseFloat(match[1]);
    }
  
    // Fallback: Try to directly parse the numeric value if no parentheses format
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      return numericValue;
    }
  
    return 0;
  };

  const totalAmount = coins.reduce((sum, coin) => sum + extractEuroValue(coin.value), 0);

  const handleCoinClick = (coin: ICoin) => {
    navigation.navigate('ClickedCoinInfo', { coin });
  };

  const fetchCollection = async (uid: string) => {
    try {
      const response = await axios.get(
        `${baseUrl}/pridobiKovanceCollection`,
        {
          params: { userId: uid },
        }
      );

      if (response.data.length === 0) {
        setEmpty(true);
      }

      setCoins(response.data);
    } catch (error) {
      console.error("Failed to fetch collection:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      const fetchUid = async () => {
        const uid = await AsyncStorage.getItem("id");
        if (uid) {
          fetchCollection(uid);
        } else {
          console.error("User ID not found");
          setLoading(false);
        }
      };

      fetchUid();

      return () => {};
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.activityIndicatorContainer}>
        <PulseIndicator color="#FFA500" size={100} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.totalView}>
        <Text style={styles.totalText}>
          Total Coins: 
          <Text style={styles.totalValueText}> {coins.length}</Text>
        </Text>
        <Text style={styles.totalText}>
          Total Amount (EUR): 
          <Text style={styles.totalValueText}> €{totalAmount.toFixed(2)}</Text>
        </Text>
      </View>
      {/* ... rest of your component ... */}

      {empty && (
        <Text style={{ fontSize: 15, textAlign: "center", marginTop: 20, fontWeight: "bold" }}>
          Your collection is empty. Go to the camera to scan your first coin!
        </Text>
      )}
      <FlatList
        data={coins}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCoinClick(item)}>
          <View style={styles.coinItem}>
            <Image source={{ uri: item.images.front }} style={styles.coinImage} />
            <Text style={styles.coinText}>{`${item.issuer} ${item.value}`}</Text>
          </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  coinItem: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  coinImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  coinText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  activityIndicatorContainer: {
    marginTop: 50,
    justifyContent: "flex-start",
  },
  totalView: {
    padding: 15,
    backgroundColor: '#f5f5f5', // Light grey background
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0', // Light grey border
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 20,
    fontWeight: "bold"
  },
  totalValueText: {
    color: '#FFA500', // Color for the numeric values
  },
  // ... other styles ...
});

export default CollectionScreen;
