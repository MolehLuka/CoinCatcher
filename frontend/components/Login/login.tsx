import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prijava</Text>
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
        placeholder="Geslo"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        onEndEditing={() => Keyboard.dismiss()}
      />
      <TouchableOpacity onPress={navigateToRegister}>
        <Text style={styles.registerLink}>
          Nimate računa? Registrirajte se tukaj
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Prijava</Text>
      </TouchableOpacity>

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
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    width: "100%",
    borderRadius: 5,
  },

  loginButton: {
    backgroundColor: "gold",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 10,
  },

  registerLink: {
    color: "#3498db",
    marginBottom: 20,
    textDecorationLine: "underline",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },

  loginButtonText: {
    color: "black",
    fontSize: 18,
  },
});

export default Login;
