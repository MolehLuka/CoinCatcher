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
import { ActivityIndicator } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
import { baseUrl } from "../../global";

import { baseUrl } from "../../global";

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
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const [image, setImage] = useState<string | null>(null);
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [isFrontOfCoin, setIsFrontOfCoin] = useState(true); // To track which side of the coin to capture

  const [cameraType, setCameraType] = useState(CameraType.back);
  const cameraRef = useRef<Camera>(null);

  const [loading, setLoading] = useState(false);
  const [coinData, setCoinData] = useState(null);

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const CameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasPermission(CameraStatus.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = cameraRef.current
          ? await (cameraRef.current as Camera).takePictureAsync()
          : null;

        if (data) {
          if (isFrontOfCoin) {
            setFrontImage(data.uri);
            setIsFrontOfCoin(false); // Next capture will be for the back
          } else {
            setBackImage(data.uri);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleRetake = () => {
    // Reset everything
    setImage(null);
    setFrontImage(null);
    setBackImage(null);
    setIsFrontOfCoin(true);
  };

  const identifyCoin = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/random-coin`);
      const data = await response.json();
      setCoinData(data);

      // simulirana 8 sekundna identifikacija
      setTimeout(() => {
        setLoading(false);
        navigation.navigate("ScannedCoinInfo", { coinData: data });
      }, 8000);
    } catch (error) {
      console.log(error);
      setLoading(false);
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
      {frontImage && backImage && (
        <View style={styles.buttonContainer}>
        {!loading ? (
          <TouchableOpacity style={styles.retakeIdentButton} onPress={identifyCoin}>
            <Text style={styles.buttonText}>Identify coin</Text>
          </TouchableOpacity>
        ) : (
          <ActivityIndicator size="large" color="#FFA500" />
        )}
        <TouchableOpacity style={styles.retakeIdentButton} onPress={handleRetake}>
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
    paddingBottom: 60,
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
    backgroundColor: "white",
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
    bottom: 130, // Adjust as needed
    alignSelf: "center",
  },
  highlight: {
    fontWeight: "bold",
    color: "#FFA500",
  },
  retakeIdentButton: {
    backgroundColor: '#FFA500', // Orange color
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
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
