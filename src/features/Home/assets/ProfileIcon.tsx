import Svg, { Path, Rect } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export const ProfileIcon = ({ width = 34, height = 34, color = "#FAFAFA" }: IconProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Rect width={width} height={height} rx="17" fill="#002233" />
      <Path d="M18.125 11H15.125V14H18.125V11Z" fill={color} />
      <Path d="M13.625 20H10.625V23H13.625V20Z" fill={color} />
      <Path d="M13.625 15.5H10.625V18.5H13.625V15.5Z" fill={color} />
      <Path d="M13.625 11H10.625V14H13.625V11Z" fill={color} />
      <Path d="M22.625 11H19.625V14H22.625V11Z" fill={color} />
      <Path d="M15.875 21.395V23H17.45L21.935 18.5225L20.345 16.9325L15.875 21.395Z" fill={color} />
      <Path d="M18.125 17.0225V15.5H15.125V18.5H16.6475L18.125 17.0225Z" fill={color} />
      <Path
        d="M23.2625 16.67L22.205 15.6125C22.055 15.4625 21.8225 15.4625 21.6725 15.6125L20.8775 16.4075L22.4675 17.9975L23.2625 17.2025C23.4125 17.0525 23.4125 16.82 23.2625 16.67Z"
        fill={color}
      />
    </Svg>
  );
};
