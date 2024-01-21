import React from 'react';
import Svg, { Rect, Circle, Defs, Mask } from 'react-native-svg';
import { StyleSheet } from 'react-native';

export const CameraOverlay = () => {
  return (
    <Svg style={StyleSheet.absoluteFill}>
      <Defs>
        <Mask id="mask" x="0" y="0" height="100%" width="100%">
          <Rect height="100%" width="100%" fill="#fff" />
          <Circle r={125} cx="50%" cy="50%" fill="black" />
        </Mask>
      </Defs>
      <Rect height="100%" width="100%" fill="rgba(0, 0, 0, 0.5)" mask="url(#mask)" />
    </Svg>
  );
};
