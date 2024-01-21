import React, { useEffect, useState } from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CollectionScreen from '../Collection/collection';
import HomeScreen from '../HomeScreen/home';
import ScannedCoinInfo from '../ScannedCoinInfo/scannedcoininfo';
import Login from '../Login/login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Register from '../Register/register';
import Icon from 'react-native-elements/dist/icons/Icon';
import Trznica from '../Trznica/trznica';
import DodajKovanecScreen from '../DodajTrznica/dodajtrznica';
import { CameraScreen } from '../CameraScreen/camera';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const CameraStack = createStackNavigator();

function CameraStackNavigator() {
  return (
    <CameraStack.Navigator>
      <CameraStack.Screen name="CameraScreen" component={CameraScreen} options={{ headerShown: false }} />
      <CameraStack.Screen name="ScannedCoinInfo" component={ScannedCoinInfo} options={{ headerShown: false }} />
    </CameraStack.Navigator>
  );
}



function Navigator() {
  return (

    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
          name="Camera"
          component={CameraStackNavigator}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="camera" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen name="Collection" component={CollectionScreen} />
        <Tab.Screen name="Trznica" component={Trznica} />
    </Tab.Navigator>
    

  );
}

const AppNavigator = () => {
  const [initialRouteName, setInitialRouteName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const preveriUid = async () => {
      try {
        const value = await AsyncStorage.getItem('id');
        if (value === null) {
          console.log('Vrednost ne obstaja v AsyncStorage.');
          setInitialRouteName('Login');
        } else {
          setInitialRouteName('Home');
        }
      } catch (error) {
        console.error('Napaka pri branju podatka iz AsyncStorage:', error);
      } finally {
        setLoading(false);
      }
    };

    preveriUid();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
        <Stack.Screen name="App" component={Navigator} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="DodajTrznica" component={DodajKovanecScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
