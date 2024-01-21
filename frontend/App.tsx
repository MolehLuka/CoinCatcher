import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigator from './components/Navigation/navigation';
import { AuthProvider } from './authcontext';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App() {



  return (
    <View style={styles.container}>
       <AuthProvider>
      <AppNavigator />
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
