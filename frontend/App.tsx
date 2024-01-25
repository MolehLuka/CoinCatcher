import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AppNavigator from "./components/Navigation/navigation";
import { AuthProvider } from "./authcontext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LogBox } from "react-native";

import LoadingScreen from "./components/LoadingScreen/loadingscreen";

export default function App() {
  LogBox.ignoreAllLogs();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 4000);
  }, []);

  return (
    <View style={styles.container}>
      <AuthProvider>
        {loading ? <LoadingScreen /> : <AppNavigator />}
        <StatusBar style="auto" />
      </AuthProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
