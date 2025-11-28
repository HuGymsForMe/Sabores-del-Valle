import * as React from "react";
import Svg, { Path } from "react-native-svg";

export default function IconoInfo() {
  return (
    <Svg
      width={32}
      height={32}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zM12 22C6.5 22 2 17.5 2 12S6.5 2 12 2c5.5 0 10 4.5 10 10S17.5 22 12 22zM11 9h2V6h-2V9zM11 18h2v-7h-2V18z"
        fill="#263238"
      />
    </Svg>
  );
}
