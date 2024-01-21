import React, { useState, useEffect } from 'react';
import { Button, Image, View, Text, TextInput, StyleSheet, Keyboard, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import axios, { AxiosResponse } from 'axios';
import { baseUrl } from '../../global';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface RegisterProps {
  navigation: NativeStackNavigationProp<any>;
}

const DodajKovanecScreen = ({ navigation }: RegisterProps) => {
  const [ime, setIme] = useState('');
  const [opis, setOpis] = useState('');
  const [kolicina, setKolicina] = useState('');
  const [slika, setSlika] = useState('');

  const [image, setImage] = useState(null);


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
        // Create FormData object
        const formData = new FormData();
  
        // Append text data
        formData.append('ime', ime);
        formData.append('opis', opis);
        formData.append('kolicina', kolicina);
  
        // Append image data
        if (image) {
          const localUri: string = image;
          const filename: string = localUri.split('/').pop() || '';
  
          // Infer the type of the image
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image';
  
          // Explicitly cast to any to avoid TypeScript errors
          formData.append('slika', {
            uri: localUri,
            name: filename,
            type,
          } as any);
        }
  
        // Make the request to get phone number and add current date
        const phoneNumberResponse = await axios.get(`${baseUrl}/getPhoneNumber`);
        const phoneNumber = phoneNumberResponse.data.phoneNumber;
  
        // Append phone number and current date to the form data
        formData.append('telefonskaSt', phoneNumber);
        formData.append('datum', new Date().toISOString());
  
        // Make the request to add the coin with updated form data
        const response = await axios.post(`${baseUrl}/dodajSvojKovanec`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        console.log('Odgovor od backend-a:', response.data);
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
      underlayColor="#3D8B3D" // Customize the color when pressed
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
      position: 'absolute', // Position the header absolutely
      top: 20,
      left: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      // You may adjust these styles based on your preference
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
      textAlign: 'center', // Center the text within the button
    },

  });
  
export default DodajKovanecScreen;
