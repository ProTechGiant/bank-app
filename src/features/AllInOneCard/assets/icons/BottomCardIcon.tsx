import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function BottomCardIcon({ width = 350, height = 352, color = "#2C2636" }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 350 352" fill="none">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M332.005 0H16.9952C16.8122 6.57693 11.4231 11.8523 4.80198 11.8523H0V336C0 344.837 7.16343 352 16 352H334C342.837 352 350 344.837 350 336V11.8523H344.198C337.577 11.8523 332.188 6.57693 332.005 0Z"
        fill={color}
      />
    </Svg>
  );
}
