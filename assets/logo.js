import * as React from "react";
import Svg, { Rect, Path } from "react-native-svg";

export default function Logo(props) {
  return (
    <Svg width={60} height={60} viewBox="0 0 60 60" fill="none" {...props}>
      <Rect width="60" height="60" rx="12" fill="#F3F4F6" />
      <Path
        d="M20 18h20M20 30h20M20 42h20"
        stroke="#6366F1"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </Svg>
  );
}
