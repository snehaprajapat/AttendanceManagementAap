import * as React from "react";
import { View } from "react-native";
import Svg, { Rect, LinearGradient, Stop, Defs } from "react-native-svg";

export default function AppIcon(props) {
  return (
    <View style={{ width: props.size || 64, height: props.size || 64, borderRadius: 16, overflow: 'hidden' }}>
      <Svg width="100%" height="100%" viewBox="0 0 64 64" fill="none">
        <Defs>
          <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#4A90E2" />
            <Stop offset="50%" stopColor="#DB2777" />
            <Stop offset="100%" stopColor="#F472B6" />
          </LinearGradient>
        </Defs>
        <Rect width="64" height="64" rx="16" fill="url(#gradient)" />
      </Svg>
    </View>
  );
}
