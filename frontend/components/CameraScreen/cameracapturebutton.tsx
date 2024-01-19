import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";

interface CameraCaptureButtonProps {
  onPress: () => void;
}

export const CameraCaptureButton: React.FC<CameraCaptureButtonProps> = ({
  onPress,
}) => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.innerCircle} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginBottom: 20,
      },
      button: {
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 50,
        padding: 15,
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
      },
      innerCircle: {
        backgroundColor: 'white',
        borderRadius: 50,
        width: 50,
        height: 50,
      },
});
