import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { baseUrl } from '../../global';

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

const Trznica = () => {
  const [coinData, setCoinData] = useState<MyCoin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/pridobiKovanceTrznica`);
        const documents = response.data.documents;

        // Map over the documents array and extract relevant data
        const newCoinData: MyCoin[] = documents.map((document: any) => ({
          id: document.id,
          data: {
            ime: document.data.ime,
            kolicina: document.data.kolicina,
            opis: document.data.opis,
            slika: document.data.slika,
          },
        }));

        // Set the new coin data into the state
        setCoinData(newCoinData);
        setLoading(false);
      } catch (error) {
        console.error('Napaka pri pridobivanju podatkov o kriptovalutah', error);
        setLoading(false);
      }
    };

    fetchCoinData();
  }, [coinData]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kriptovalute</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={coinData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CoinItem coin={item} />}
        />
      )}
    </View>
  );
};


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
    width: 50,
    height: 50,
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
});

export default Trznica;
