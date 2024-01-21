import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Button,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { CameraCaptureButton } from "./cameracapturebutton";
import { CameraOverlay } from "./cameraoverlay";
import { ActivityIndicator, ImageBackground } from "react-native";
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from "react-native-indicators";

import { StackNavigationProp } from "@react-navigation/stack";
import { baseUrl } from "../../global";

import { useFocusEffect } from '@react-navigation/native';

type RootStackParamList = {
  ScannedCoinInfo: { coinData: any };
  CameraScreen: undefined;
  // Add other screen names and their respective params if needed
};

type CameraScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CameraScreen"
>;

type Props = {
  navigation: CameraScreenNavigationProp;
};

export const CameraScreen: React.FC<Props> = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null); // ali ima aplikacija dovoljenje za uporabo kamere

  const [frontImage, setFrontImage] = useState<string | null>(null); // sprednja stran kovanca
  const [backImage, setBackImage] = useState<string | null>(null); // zadnja stran kovanca
  const [isFrontOfCoin, setIsFrontOfCoin] = useState(true); // ali je trenutno slikana sprednja stran kovanca ali zadnja

  const [cameraType, setCameraType] = useState(CameraType.back);
  const cameraRef = useRef<Camera>(null);

  const [loading, setLoading] = useState(false);
  const [coinData, setCoinData] = useState(null);

  const [buttonsDisabled, setButtonsDisabled] = useState(false); // ali so gumbi onemogoceni

  // resetira vsa stanja, ko se navigira nazaj na to stran
  useFocusEffect(
    React.useCallback(() => {
      setHasPermission(null);
      setFrontImage(null);
      setBackImage(null);
      setIsFrontOfCoin(true);
      setLoading(false);
      setCoinData(null);
      setButtonsDisabled(false);
  
      return () => {
        // You can perform any additional cleanup here if necessary
      };
    }, [])
  );

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const CameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasPermission(CameraStatus.status === "granted");
    })();
  }, []);


  // funkcija za slikanje
  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = cameraRef.current
          ? await (cameraRef.current as Camera).takePictureAsync()
          : null;

        if (data) {
          // shranjevanje slik v stanje
          if (isFrontOfCoin) {
            setFrontImage(data.uri);
            setIsFrontOfCoin(false); // nato slikaj zadnjo stran kovanca
          } else {
            setBackImage(data.uri);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // dovoljenje za uporabo kamere ni bilo podano
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleRetake = () => {
    // resetiraj vse spremenljivke za slikanje
    setFrontImage(null);
    setBackImage(null);
    setIsFrontOfCoin(true);
  };

  const identifyCoin = async () => {
    setButtonsDisabled(true); // gumbi se onemogocijo med identifikacijo
    setLoading(true);
    try {
      const response = await fetch("http://192.168.1.107:3000/random-coin");
      const data = await response.json();

      // simulirana 8 sekundna identifikacija
      setTimeout(() => {
        setLoading(false);
        setButtonsDisabled(false); // gumbi se omogocijo po identifikaciji
        navigation.navigate("ScannedCoinInfo", { coinData: data });
      }, 8000);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setButtonsDisabled(false);
    }
  };

  // Render logic
  return (
    <View
      style={
        !frontImage || !backImage
          ? styles.cameraContainer
          : styles.previewContainer
      }
    >
      {!frontImage || !backImage ? (
        <Camera style={styles.camera} type={cameraType} ref={cameraRef}>
          <CameraOverlay />
          <Text style={styles.instructions}>
            {isFrontOfCoin ? (
              <Text style={styles.instructions}>
                Capture <Text style={styles.highlight}>front</Text> of coin
              </Text>
            ) : (
              <Text style={styles.instructions}>
                Capture <Text style={styles.highlight}>back</Text> of coin
              </Text>
            )}
          </Text>
          {!loading && (
            <View style={styles.cameraButtonContainer}>
              <CameraCaptureButton onPress={takePicture} />
            </View>
          )}
        </Camera>
      ) : (
        <>
          <Image source={{ uri: frontImage }} style={styles.preview} />
          <Image source={{ uri: backImage }} style={styles.preview} />
        </>
      )}
      {loading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Identifying coin...</Text>
        </View>
      )}
      {frontImage && backImage && (
        <View style={styles.buttonContainer}>
          {!loading ? (
            <TouchableOpacity
              style={[
                styles.retakeIdentButton,
                buttonsDisabled && { opacity: 0.5 },
              ]}
              onPress={identifyCoin}
              disabled={buttonsDisabled}
            >
              <Text style={styles.buttonText}>Identify coin</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.activityIndicatorContainer}>
              <PulseIndicator color="#FFA500" />
            </View>
          )}
          <TouchableOpacity
            style={[
              styles.retakeIdentButton,
              buttonsDisabled && { opacity: 0.5 },
            ]}
            onPress={handleRetake}
            disabled={buttonsDisabled}
          >
            <Text style={styles.buttonText}>Retake</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    borderRadius: 20,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    paddingBottom: 0,
  },
  preview: {
    width: "150%",
    height: "50%",
    resizeMode: "cover",
    alignSelf: "center",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "transparent",
  },
  cameraButtonContainer: {
    position: "absolute",
    bottom: -10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "transparent",
  },
  instructions: {
    position: "absolute",
    color: "white",
    fontSize: 18,
    bottom: 130,
    alignSelf: "center",
  },
  highlight: {
    fontWeight: "bold",
    color: "#FFA500",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject, // This will make the view cover the whole screen
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent black background
    zIndex: 10, // Make sure it covers other elements
  },
  loadingText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  retakeIdentButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 3, // Add elevation for Android shadow
    shadowColor: "#000000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow for iOS
    shadowOpacity: 0.3, // Shadow for iOS
    shadowRadius: 2, // Shadow for iOS
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  activityIndicatorContainer: {
    justifyContent: "flex-start",
  },
});
