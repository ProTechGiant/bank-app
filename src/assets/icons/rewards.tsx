import { Path, Svg } from "react-native-svg";

import { IconProps } from "./index";

export default function Rewards({ width = 24, height = 24, color = "#FF7512" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M10.6602 8.89L11.6002 12H14.4202L12.1502 13.62L13.0802 16.63L10.6602 14.79L8.24016 16.63L9.17016 13.62L6.90016 12H9.72016L10.6602 8.89ZM8.24016 10H0.660156L6.83016 14.41L4.49016 22L10.6602 17.31L16.8402 22L14.4902 14.41L20.6602 10H13.0802L10.6602 2L8.24016 10ZM21.0202 22L19.1602 15.99L23.3402 13H19.9002L16.8202 15.2L18.2802 19.92L21.0202 22ZM16.6602 8L14.8402 2L13.8002 5.45L14.5702 8H16.6602Z"
        fill={color}
      />
    </Svg>
  );
}
