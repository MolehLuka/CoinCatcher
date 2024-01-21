import axios from 'axios';
import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../authcontext';
import { baseUrl } from '../../global';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {

  return (
    <View>
      <Text>Home Screen</Text>

        <Text>Logout</Text>

    </View>
  );
}