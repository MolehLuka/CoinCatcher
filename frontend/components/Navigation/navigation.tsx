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
import { Ionicons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";

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
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconStyle = {};

          if (route.name === "Camera") {
            iconName = "camera"; // Change the icon name based on your preference
            color = focused ? "#FFA500" : color; // Change the color when focused
            size = 50;
          }
          if (route.name === "Collection") {
            iconName = "bookmarks"; // Change the icon name based on your preference
            color = focused ? "#FFA500" : color; // Change the color when focused
            iconStyle = { marginTop: 10 };
          }
          if (route.name === "Trznica") {
            iconName = "cart"; // Change the icon name based on your preference
            color = focused ? "#FFA500" : color; // Change the color when focused
            size = 35
            iconStyle = { marginTop: 5 };
          }
          // ... handle other icons

          return <Ionicons name={iconName as any} size={size} color={color} style={iconStyle}/>;
        }, // This will hide the label
        tabBarActiveTintColor: "#FFA500", // Color of the icon when the tab is active
        tabBarInactiveTintColor: "gray", // Color of the icon when the tab is inactive
      })}
    >
      <Tab.Screen
        name="Collection"
        component={CollectionScreen}
        options={{ headerShown: false, tabBarLabelStyle: { fontWeight: "bold" } }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen name="Trznica" options={{ headerShown: false, tabBarLabelStyle: { fontWeight: "bold" }}}>
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
        <Stack.Screen name="CoinCatcher" options={{headerTitleAlign: "left"}}>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
