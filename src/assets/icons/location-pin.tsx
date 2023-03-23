import Svg, { Path } from "react-native-svg";

import { IconProps } from ".";

const LocationPinIcon = ({ width = 24, height = 24, color = "#080E53" }: IconProps) => {
  return (
    <Svg width={height} height={width} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M18 8c0-3.31-2.69-6-6-6S6 4.69 6 8c0 4.5 6 11 6 11s6-6.5 6-11zm-8 0c0-1.1.9-2 2-2s2 .9 2 2a2 2 0 11-4 0zM5 20v2h14v-2H5z"
        fill={color}
      />
    </Svg>
  );
};

export { LocationPinIcon };
