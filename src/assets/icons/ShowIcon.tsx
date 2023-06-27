import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function ShowIcon({ width = 14, height = 14, color = "#CFCFDD" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M7.00004 3.79167C9.21087 3.79167 11.1825 5.03417 12.145 7C11.1825 8.96583 9.21087 10.2083 7.00004 10.2083C4.78921 10.2083 2.81754 8.96583 1.85504 7C2.81754 5.03417 4.78921 3.79167 7.00004 3.79167ZM7.00004 2.625C4.08337 2.625 1.59254 4.43917 0.583374 7C1.59254 9.56083 4.08337 11.375 7.00004 11.375C9.91671 11.375 12.4075 9.56083 13.4167 7C12.4075 4.43917 9.91671 2.625 7.00004 2.625ZM7.00004 5.54167C7.80504 5.54167 8.45837 6.195 8.45837 7C8.45837 7.805 7.80504 8.45833 7.00004 8.45833C6.19504 8.45833 5.54171 7.805 5.54171 7C5.54171 6.195 6.19504 5.54167 7.00004 5.54167ZM7.00004 4.375C5.55337 4.375 4.37504 5.55333 4.37504 7C4.37504 8.44667 5.55337 9.625 7.00004 9.625C8.44671 9.625 9.62504 8.44667 9.62504 7C9.62504 5.55333 8.44671 4.375 7.00004 4.375Z"
        fill={color}
      />
    </Svg>
  );
}
