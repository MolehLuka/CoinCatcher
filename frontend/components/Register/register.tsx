import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
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

interface RegisterProps {
  navigation: NativeStackNavigationProp<any>;
}

function Register({ navigation }: RegisterProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [response, setResponse] = useState("")
  const { user, setUser } = useAuth();

  const [isModalVisible, setModalVisible] = useState(false);

  const handleRegister = async (): Promise<void> => {
    try {
      const response: AxiosResponse = await axios.post(`${baseUrl}/register`, {
        email: email,
        password: password,
      });

    
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

  const handle = () =>{ 
    console.log(user)
  }
  

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text>Registracija</Text>
      <Button title="OK2" onPress={handle} />
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
      <Button title="Register" onPress={handleRegister} />

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

export default Register;
