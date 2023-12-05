import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function TransactionArrowIcon({ width = 24, height = 24, color = "#02B194" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M4.6 19.4a1.087 1.087 0 01-.325-.8c0-.317.108-.583.325-.8L15.275 7.15H10c-.317 0-.587-.113-.812-.338A1.105 1.105 0 018.85 6c0-.317.113-.588.338-.813.225-.225.495-.337.812-.337h8c.317 0 .587.112.812.337.225.225.338.496.338.813v8c0 .317-.113.587-.338.812a1.105 1.105 0 01-.812.338c-.317 0-.587-.113-.812-.338A1.105 1.105 0 0116.85 14V8.725l-10.675 10.7a1.017 1.017 0 01-.775.313 1.197 1.197 0 01-.8-.338z"
        fill={color}
      />
    </Svg>
  );
}
