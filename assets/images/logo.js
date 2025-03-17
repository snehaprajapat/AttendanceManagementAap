import * as React from "react";
import { View } from "react-native";
import Svg, { Rect, LinearGradient, Stop, Defs } from "react-native-svg";

export default function Logo(props) {
  return (
    <View style={{ width: props.size || 48, height: props.size || 48, borderRadius: 12, overflow: 'hidden' }}>
      <Svg width="100%" height="100%" viewBox="0 0 48 48" fill="none">
        <Defs>
          <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#6FB1FC" />
            <Stop offset="100%" stopColor="#B185DB" />
          </LinearGradient>
        </Defs>
        <Rect width="48" height="48" rx="12" fill="url(#gradient)" />
      </Svg>
    </View>
  );
}
