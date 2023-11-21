import Svg, { Path, Rect } from "react-native-svg";

import { IconProps } from "@/assets/icons/index";

export function NicknameIcon({ width = 44, height = 44, color = "#F2F2F2" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Rect width={width} height={height} rx="22" fill={color} />
      <Path
        d="M12.9338 18.5H23.9338V20.5H12.9338V18.5ZM12.9338 16.5H23.9338V14.5H12.9338V16.5ZM12.9338 24.5H19.9338V22.5H12.9338V24.5ZM27.9438 21.37L28.6538 20.66C29.0438 20.27 29.6738 20.27 30.0638 20.66L30.7738 21.37C31.1638 21.76 31.1638 22.39 30.7738 22.78L30.0638 23.49L27.9438 21.37ZM27.2338 22.08L21.9338 27.38V29.5H24.0538L29.3538 24.2L27.2338 22.08Z"
        fill="#2E2E2E"
      />
    </Svg>
  );
}
