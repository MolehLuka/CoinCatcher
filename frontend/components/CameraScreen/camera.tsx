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
import CameraButton from "./camerabutton";
import { CameraOverlay } from "./cameraoverlay";
import { ActivityIndicator } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
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
        console.log(data);
        if (data) {
          setImage(data.uri);
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
    setImage(null); // Reset image state to bring back camera
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
    <View style={styles.container}>
      {!image ? (
        <Camera style={styles.camera} type={cameraType} ref={cameraRef}>
          <CameraOverlay />
        </Camera>
      ) : (
        <>
          <View style={styles.previewContainer}>
            <Image source={{ uri: image }} style={styles.preview} />
          </View>
          <View style={styles.buttonContainer}>
            {!loading ? (
              <Button title={"Identify coin"} onPress={identifyCoin} color={"white"} />
            ) : (
              <ActivityIndicator size="large" color="#0000ff" />
            )}
            <Button title={"Retake"} onPress={handleRetake} color={"white"} />
          </View>
        </>
      )}
      {!image && !loading && (
        <CameraButton
          title={"Capture coin"}
          icon="camera"
          onPress={takePicture}
          color={"white"}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    paddingBottom: 20,
  },
  camera: {
    flex: 1,
    borderRadius: 20,
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  preview: {
    width: "150%",
    height: "150%",
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
