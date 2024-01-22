// Frontend in React Native
import React, { useState, useEffect } from 'react';
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

  const handleCoinClick = (coin: ICoin) => {
    navigation.navigate('ClickedCoinInfo', { coin });
  };

  useEffect(() => {
    const fetchCollection = async (uid: string) => {
      try {
        const response = await axios.get(`${baseUrl}/pridobiKovanceCollection`, {
          params: { userId: uid },
        });

        setCoins(response.data);
      } catch (error) {
        console.error('Failed to fetch collection:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUid = async () => {
      const uid = await AsyncStorage.getItem("id");
      console.log(uid);
      if (uid) {
        fetchCollection(uid);
      } else {
        console.error('User ID not found');
        setLoading(false);
      }
    };

    fetchUid();
  }, []);

  if (loading) {
    return (
      <View style={styles.activityIndicatorContainer}>
        <PulseIndicator color="#FFA500" size={100} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
    backgroundColor: 'white',
  },
  coinItem: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  coinImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  coinText: {
    fontSize: 18,
  },
  activityIndicatorContainer: {
    marginTop: 50,
    justifyContent: "flex-start",
  },
  // ... other styles ...
});

export default CollectionScreen;
