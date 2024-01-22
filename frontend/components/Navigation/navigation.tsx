import React, { useEffect, useState } from "react";
import { View, StatusBar, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CollectionScreen from "../Collection/collection";
import ScannedCoinInfo from "../ScannedCoinInfo/scannedcoininfo";
import Login from "../Login/login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Register from "../Register/register";
import Icon from "react-native-elements/dist/icons/Icon";
import Trznica, { MyCoin } from "../Trznica/trznica";
import DodajKovanecScreen from "../DodajTrznica/dodajtrznica";
import { CameraScreen } from "../CameraScreen/camera";
import darkColors from "react-native-elements/dist/config/colorsDark";
import CoinModal from "../Filter/CoinModal";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const CameraStack = createStackNavigator();

function CameraStackNavigator() {
  return (
    <CameraStack.Navigator>
      <CameraStack.Screen
        name="CameraScreen"
        component={CameraScreen}
        options={{ headerShown: false }}
      />
      <CameraStack.Screen
        name="ScannedCoinInfo"
        component={ScannedCoinInfo}
        options={{ headerShown: false }}
      />
    </CameraStack.Navigator>
  );
}

interface NavigatorProps {
  dataChange: MyCoin | null;
}

function Navigator({ dataChange }: NavigatorProps) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Collection" component={CollectionScreen} />
      <Tab.Screen
        name="Camera"
        component={CameraStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="camera" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen name="Trznica" options={{ headerShown: false }}>
        {(props) => <Trznica dataChange={dataChange} {...props} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const AppNavigator = () => {
  const [initialRouteName, setInitialRouteName] = useState("");
  const [loading, setLoading] = useState(true);
  const [dataChange, setDataChange] = useState<MyCoin | null>(null);

  useEffect(() => {
    const preveriUid = async () => {
      try {
        const value = await AsyncStorage.getItem("id");
        if (value === null) {
          console.log("Vrednost ne obstaja v AsyncStorage.");
          setInitialRouteName("Login");
        } else {
          setInitialRouteName("Home");
        }
      } catch (error) {
        console.error("Napaka pri branju podatka iz AsyncStorage:", error);
      } finally {
        setLoading(false);
      }
    };

    preveriUid();
  }, []);

  const handleAddToDatabase = (coin: MyCoin) => {
    setDataChange(coin);
  };

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
        <Stack.Screen name="CoinCatcher">
          {(props) => <Navigator {...props} dataChange={dataChange} />}
        </Stack.Screen>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="DodajTrznica" options={{ headerShown: false }}>
          {(props) => (
            <DodajKovanecScreen
              {...props}
              handleAddToDatabase={handleAddToDatabase}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Podrobnosti" options={{ headerShown: false }}>
          {(props) => (
            <CoinModal
            visible={false} {...props}
            coin={null}            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
