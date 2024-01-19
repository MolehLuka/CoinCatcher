import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { CameraScreen } from "../CameraScreen/camera";
import { Icon } from "react-native-elements";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CollectionScreen from "../Collection/collection";
import HomeScreen from "../HomeScreen/home";
import ScannedCoinInfo from "../ScannedCoinInfo/scannedcoininfo";
import Register from "../Register/register";
import Login from "../Login/login";
import DodajKovanecScreen from "../DodajTrznica/dodajtrznica";
import Trznica from "../Trznica/trznica";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const CameraStack = createStackNavigator();

function CameraStackNavigator() {
  return (
    <CameraStack.Navigator>
      <CameraStack.Screen name="CameraScreen" component={CameraScreen} />
      <CameraStack.Screen name="ScannedCoinInfo" component={ScannedCoinInfo} />
    </CameraStack.Navigator>
  );
}

const setUid = () =>{

}


const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
      <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Dodaj" component={DodajKovanecScreen}/>
        <Stack.Screen name="Trznica" component={Trznica}/>
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
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
