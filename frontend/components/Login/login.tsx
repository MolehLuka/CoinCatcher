import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import auth from '@react-native-firebase/auth';

import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";
import axios, { AxiosResponse } from "axios";
import { useAuth } from "../../authcontext";
const baseUrl = "http://10.0.2.2:3000";

interface LoginProps {
  navigation: NativeStackNavigationProp<any>;
}

function Login({ navigation }: LoginProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [response, setResponse] = useState("")
  const { user, setUser } = useAuth();

  const [isModalVisible, setModalVisible] = useState(false);


  const handleLogin = async (): Promise<void> => {
    try {
      const response: AxiosResponse = await axios.post(`${baseUrl}/login`, {
        email: email,
        password : password,
      });

      const user = response.data.user;
      setUser(user)

    
      console.log('Odgovor od backend-a:', response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios Error:', error);

        if (error.response) {
          console.error('Error Response Data:', error.response.data);
          setResponse(error.response.data.message)
          setModalVisible(true);

        }
      } else {
        console.error('Napaka pri klicanju backend-a:', error);
      }
    }
  };
  

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text>Registracija</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Geslo"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />

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
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
});

export default Login;
