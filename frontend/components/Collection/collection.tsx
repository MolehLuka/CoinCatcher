// Frontend in React Native
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { baseUrl } from "../../global";
import { PulseIndicator } from "react-native-indicators";

const CollectionScreen = () => {
  const [coins, setCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
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

    const fetchUid = async () => {
      const uid = await AsyncStorage.getItem("id");
      console.log(uid);
      if (uid) {
        fetchCollection(uid);
      } else {
        console.error("User ID not found");
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
      {empty && (
        <Text style={{ fontSize: 15, textAlign: "center", marginTop: 20, fontWeight: "bold" }}>
          Your collection is empty. Go to the camera to scan your first coin!
        </Text>
      )}
      <FlatList
        data={coins}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.coinItem}>
            {/* Render coin images and details */}
            <Image
              source={{ uri: item.images.front }}
              style={styles.coinImage}
            />
            <Text
              style={styles.coinText}
            >{`${item.issuer} ${item.value}`}</Text>
            {/* ... other coin details ... */}
          </View>
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
  },
  activityIndicatorContainer: {
    marginTop: 50,
    justifyContent: "flex-start",
  },
  // ... other styles ...
});

export default CollectionScreen;
