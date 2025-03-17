import * as React from "react";
import Svg, { Path } from "react-native-svg";

export default function CalendarIcon(props) {
  return (
    <Svg width={48} height={48} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M8 2v3m8-3v3M3.5 9.09h17m-17-4.5h17a1 1 0 011 1V19a1 1 0 01-1 1h-17a1 1 0 01-1-1V5.59a1 1 0 011-1z"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
