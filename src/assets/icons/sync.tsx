import { Path, Svg } from "react-native-svg";

import { IconProps } from "./index";

export default function Sync({ width = 20, height = 20, color = "#FF7512" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M9.99992 3.33331V0.833313L6.66659 4.16665L9.99992 7.49998V4.99998C12.7583 4.99998 14.9999 7.24165 14.9999 9.99998C14.9999 10.8416 14.7916 11.6416 14.4166 12.3333L15.6333 13.55C16.2833 12.525 16.6666 11.3083 16.6666 9.99998C16.6666 6.31665 13.6833 3.33331 9.99992 3.33331ZM9.99992 15C7.24159 15 4.99992 12.7583 4.99992 9.99998C4.99992 9.15831 5.20825 8.35831 5.58325 7.66665L4.36659 6.44998C3.71659 7.47498 3.33325 8.69165 3.33325 9.99998C3.33325 13.6833 6.31659 16.6666 9.99992 16.6666V19.1666L13.3333 15.8333L9.99992 12.5V15Z"
        fill={color}
      />
    </Svg>
  );
}
