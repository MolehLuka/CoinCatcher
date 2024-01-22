import React, { useState, useEffect } from 'react';
import { Button, Image, View, Text, TextInput, StyleSheet, Keyboard, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { Icon } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import axios, { AxiosResponse } from 'axios';
import { baseUrl } from '../../global';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../authcontext';
import { MyCoin } from '../Trznica/trznica';

export interface DodajTrznicaProps {
  navigation: NativeStackNavigationProp<any>;
  handleAddToDatabase: (coin:MyCoin) => any;
}

const DodajKovanecScreen = ({ navigation, handleAddToDatabase}: DodajTrznicaProps) => {
  const [ime, setIme] = useState('');
  const [opis, setOpis] = useState('');
  const [kolicina, setKolicina] = useState('');
  const [slika, setSlika] = useState('');
  const [uid, setUid] = useState<string | null>('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchUid = async () => {
      const value = await AsyncStorage.getItem('id');
      setUid(value);
      console.log(value)
    };

    fetchUid();
  }, []);

  const pickImage = async (fromCamera: boolean) => {
    let result;
    if (fromCamera) {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }

    console.log(result);
    if (!result.canceled) {
        setImage((result as any).assets[0].uri);
      }
    };

    function handleGoBack() {
      navigation.goBack();
    }

 


  
    const handleDodajKovanec = async (): Promise<void> => {
      try {
        const formData = new FormData();
  
        formData.append('ime', ime);
        formData.append('opis', opis);
        formData.append('kolicina', kolicina);
  

        if (image) {
          const localUri: string = image;
          const filename: string = localUri.split('/').pop() || '';
  

          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image';
  

          formData.append('slika', {
            uri: localUri,
            name: filename,
            type,
          } as any);
        }

        console.log(uid)

        const phoneNumberResponse = await axios.get(`${baseUrl}/getUser/${uid}`);
        const phoneNumber = phoneNumberResponse.data.user.telefonskaSt;
        console.log(phoneNumber)
  
        formData.append('telefonskaSt', phoneNumber);
        formData.append('datum', new Date().toISOString());
  
        const response = await axios.post(`${baseUrl}/dodajSvojKovanec`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Odgovor od backend-a:', response.data);
        const addedCoin: MyCoin = {
          id: response.data.id,
          data: {
            ime,
            opis,
            kolicina,
            slika: response.data.slika, 
          },
        };
        handleAddToDatabase(addedCoin)

      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Axios Error:', error);
  
          if (error.response) {
            console.error('Error Response Data:', error.response.data);
          }
        } else {
          console.error('Napaka pri klicanju backend-a:', error);
        }
      }
    };
   
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Icon name="chevron-left" type="font-awesome" />
          </TouchableOpacity>
  
          </View>
  
          <TextInput
            style={styles.input}
            placeholder="Ime kovanca"
            onChangeText={setIme}
            value={ime}
          />
          <TextInput
            style={styles.input}
            placeholder="Opis kovanca"
            onChangeText={setOpis}
            value={opis}
          />
          <TextInput
            style={styles.input}
            placeholder="Količina"
            onChangeText={setKolicina}
            value={kolicina}
            keyboardType="numeric"
          />
  
          <View style={styles.imagePickerContainer}>
            <Icon
              name="camera"
              type="font-awesome"
              onPress={() => pickImage(true)}
              containerStyle={styles.iconContainer}
            />
            <Icon
              name="image"
              type="font-awesome"
              onPress={() => pickImage(false)}
              containerStyle={styles.iconContainer}
            />
          </View>
  
          <TouchableHighlight
      style={styles.button}
      underlayColor="#3D8B3D" 
      onPress={handleDodajKovanec}
    >
      <Text style={styles.buttonText}>OBJAVI</Text>
    </TouchableHighlight>
          {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
        </View>
      </TouchableWithoutFeedback>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    header: {
      position: 'absolute', 
      top: 20,
      left: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {

      backgroundColor: 'transparent',
      padding: 15,
      marginTop: 10
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
    },

    input: {
      height: 40,
      borderColor: 'lightblue',
      borderWidth: 1,
      marginBottom: 10,
      padding: 10,
      width: '100%',
      borderRadius: 8,
      backgroundColor: '#f3f3f3',
    },
    imagePickerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginVertical: 20,
    },
    iconContainer: {
      backgroundColor: 'lightgrey',
      padding: 25,
      borderRadius: 15,
      marginHorizontal: 10,
    },
    imagePreview: {
      width: 200,
      height: 200,
      marginTop: 10,
      borderRadius: 8,
    },
    button: {
      backgroundColor: 'gold',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 15,
      marginTop: 20,
    },
    buttonText: {
      color: 'black',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center', 
    },

  });
  
export default DodajKovanecScreen;
