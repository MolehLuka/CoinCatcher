import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AwesomeButton from "react-native-really-awesome-button";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import Modal from "react-native-modal";
import axios, { AxiosResponse } from "axios";
import { useAuth } from "../../authcontext";
import { baseUrl } from "../../global";

interface LoginProps {
  navigation: NativeStackNavigationProp<any>;
}

function Login({ navigation }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");
  const { setUser } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);

  const handleLogin = async (): Promise<void> => {
    try {
      const response: AxiosResponse = await axios.post(`${baseUrl}/login`, {
        email: email,
        password: password,
      });

      const user = response.data.user;
      setUser(user);

      const saveData = async () => {
        try {
          await AsyncStorage.setItem("id", user);
          console.log("Podatek shranjen uspešno.");
        } catch (error) {
          console.error("Napaka pri shranjevanju podatka:", error);
        }
      };

      saveData();
      navigation.navigate("CoinCatcher");
      console.log("x");
      console.log("Odgovor od backend-a:", response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error);

        if (error.response) {
          console.error("Error Response Data:", error.response.data);
          setResponse(error.response.data.message);
          setModalVisible(true);
        }
      } else {
        console.error("Napaka pri klicanju backend-a:", error);
      }
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const navigateToRegister = () => {
    navigation.navigate("Register");
  };

  const [loading, setLoading] = useState(false);

  const onPress = async (next: (() => void) | undefined) => {
    setLoading(true);
    handleLogin()
    if(next == null){
      return ;
    }


    await new Promise((resolve) => setTimeout(resolve, 2000));

    setLoading(false);
    next();
  };

  return (
    <View style={styles.container}>
      <View>
      <View style={styles.headerContainer}>
      <Text style={styles.headerText}>CoinCatcher</Text>
 
    </View>
    </View>
   
    <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        onEndEditing={() => Keyboard.dismiss()}
      />
      <TouchableOpacity onPress={navigateToRegister}>
      <View style={styles.rowContainer}>
        <Text style={styles.mainText}>Don't have an account? Register</Text>
        <Text style={styles.registerLink}>here</Text>
      </View>
      </TouchableOpacity>
      <AwesomeButton
      progress
      onPress={(next) => onPress(next)}
      progressLoadingTime={3000} // Adjust the time based on your needs
      disabled={loading}
      backgroundColor={"#FFA500"}
      width={160}
      height={50}
      textSize={18}
      textColor="white"
    >
      {loading ? "Loading..." : "Sign in"}
    </AwesomeButton>





      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text>{response}</Text>
          <Button title="OK" onPress={closeModal} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    
  },
  input: {
    height: 50,
    marginBottom: 20,
    paddingHorizontal: 15,
    width: '100%',
    borderRadius: 8,
    backgroundColor: '#F4F4F4', // Light gray background
    borderWidth: 1,
    borderColor: '#E0E0E0', // Lighter gray border
    fontSize: 16,
    color: '#333', // Dark gray text color
  },

  loginButton: {
    backgroundColor: 'gray',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    
  },

  registerLink: {

    marginBottom: 20,
    textDecorationLine: "underline",
    fontSize: 16,
    fontWeight: 'bold', // Make the text bold
    color: '#007BFF', // Use a different color for the link
    marginLeft: 5, 
  },
  rowContainer: {
    flexDirection: 'row',

  },
  mainText: {
    fontSize: 16,
    color: '#333', // Change the color as needed
    
  },

  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  headerContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f1f1f1', // Adjust the background color as needed
  },
  headerText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: "#FFA500", // Adjust the text color as needed
    marginBottom: 20,

  },
  subtext: {
    fontSize: 14,
    color: '#666', // Adjust the text color as needed
  },
  loginButtonText: {
    color: "black",
    fontSize: 18,
  },
});

export default Login;
