import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function NeraIcon({ width = 63, height = 18, color = "#5C5874" }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 63 18" fill="none">
      <Path
        d="M43.0114 0.783203C41.1714 0.783203 39.2014 2.5132 38.7714 4.1732V1.1932H34.9414V16.9532H38.7714V8.7032C38.7714 6.1432 40.3614 4.1732 42.6614 4.1732C43.3614 4.1532 44.1214 4.5332 44.6114 4.9632L46.2214 1.9632C45.5814 1.4832 44.6214 0.793198 43.0014 0.793198L43.0114 0.783203Z"
        fill={color}
      />
      <Path
        d="M9.24 0.802734C6.62 0.802734 4.56 2.21273 3.82 3.82273V1.19273H0V16.9527H3.83V8.32273C3.83 8.32273 3.83 8.24274 3.83 8.20274C3.85 5.98274 5.66 4.18274 7.89 4.20274C9.9 4.20274 11.07 5.50273 11.07 7.54273V16.9527H14.9V6.51273C14.9 3.27273 12.82 0.802734 9.26 0.802734H9.24Z"
        fill={color}
      />
      <Path
        d="M58.4297 1.19273V4.01273C57.8297 2.45273 55.9697 0.802734 53.2397 0.802734C48.8597 0.802734 45.6797 4.43273 45.6797 9.07273C45.6797 13.7127 48.8597 17.3427 53.2397 17.3427C55.3797 17.3427 57.4897 16.0927 58.4297 14.2027V16.9527H62.2597V1.19273H58.4297ZM54.1297 13.9727C51.5997 13.9727 49.6597 11.8627 49.6597 9.07273C49.6597 6.28273 51.5997 4.17274 54.1297 4.17274C56.6597 4.17274 58.6297 6.28273 58.6297 9.07273C58.6297 11.8627 56.6897 13.9727 54.1297 13.9727Z"
        fill={color}
      />
      <Path
        d="M25.0205 0.802734C20.6405 0.802734 16.9105 4.40273 16.9105 9.07273C16.8705 13.6027 20.5105 17.3027 25.0405 17.3427C25.0505 17.3427 25.0705 17.3427 25.0805 17.3427C28.1305 17.3427 30.7805 15.8527 32.3105 13.1327L29.4105 11.4527C28.4205 13.1127 27.2305 14.0627 25.0905 14.0627C22.8205 14.0627 20.9105 12.5027 20.5205 10.2727H32.8105C32.9705 4.46274 29.7005 0.802734 25.0305 0.802734H25.0205ZM20.6705 7.38274C21.2905 5.34274 22.9705 4.04273 25.0205 4.04273C27.3505 4.04273 28.7505 5.60274 29.0105 7.38274H20.6805H20.6705Z"
        fill={color}
      />
    </Svg>
  );
}
