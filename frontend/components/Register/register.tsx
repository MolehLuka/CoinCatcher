import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import axios, { AxiosResponse } from "axios";
import { useAuth } from "../../authcontext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { baseUrl } from "../../global";

interface RegisterProps {
  navigation: NativeStackNavigationProp<any>;
}

function Register({ navigation }: RegisterProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [response, setResponse] = useState("");
  const { user, setUser } = useAuth();
  const [telefonskaSt, setTelefonskaSt] = useState("")

  const [isModalVisible, setModalVisible] = useState(false);
//x xx x
  const handleRegister = async (): Promise<void> => {
    try {
      const response: AxiosResponse = await axios.post(`${baseUrl}/register`, {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        telefonskaSt: telefonskaSt
      });
      navigation.navigate('App');
      console.log('Odgovor od backend-a:', response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios Error:', error);

        if (error.response) {
          console.error('Error Response Data:', error.response.data);
          setResponse(error.response.data.message);
          setModalVisible(true);
        }
      } else {
        console.error('Napaka pri klicanju backend-a:', error);
      }
    }
  };

  const handle = () => {
    console.log(user);
    const readData = async () => {
      try {
        const value = await AsyncStorage.getItem('id');
        if (value !== null) {
          console.log('Prebrana vrednost iz AsyncStorage:', value);

        } else {
          console.log('Vrednost ne obstaja v AsyncStorage.');
        }
      } catch (error) {
        console.error('Napaka pri branju podatka iz AsyncStorage:', error);
      }
    };
    readData();
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  function navigateToLogin() {
    navigation.navigate('Login');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registracija</Text>
      <TextInput
        style={styles.input}
        placeholder="Ime"
        onChangeText={setFirstName}
        value={firstName}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Priimek"
        onChangeText={setLastName}
        value={lastName}
        autoCapitalize="words"
      />
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
        placeholder="Telefonska številka"
        onChangeText={setTelefonskaSt}
        value={telefonskaSt}
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
      />
      <TextInput
        style={styles.input}
        placeholder="Potrdite geslo"
        onChangeText={setPasswordConfirm}
        value={passwordConfirm}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity
        onPress={handleRegister}
        style={styles.registerButton}
      >
        <Text style={styles.buttonText}>Registracija</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={navigateToLogin}>
        <Text style={styles.loginLink}>Že imate račun? Prijavite se tukaj</Text>
      </TouchableOpacity>

      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text>{response}</Text>
          <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  registerButton: {
    backgroundColor: 'gold',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "black",
    textAlign: "center",
    fontSize: 16,
  },
  loginLink: {
    color: '#3498db',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalButton: {
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonText: {
    color: "white",
    textAlign: "center",
  },
});

export default Register;
