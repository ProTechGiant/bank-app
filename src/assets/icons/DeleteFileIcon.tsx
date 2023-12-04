import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function DeleteFileIcon({ width = 23, height = 24, color = "#C50707" }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 23 24" fill="none">
      <Path
        d="M6.63724 20.8161C6.04627 20.8161 5.53516 20.6047 5.10391 20.1817C4.67266 19.7581 4.45703 19.2429 4.45703 18.6359V6.32135C4.15356 6.32135 3.898 6.21338 3.69036 5.99744C3.48273 5.78213 3.37891 5.52274 3.37891 5.21927C3.37891 4.9158 3.48273 4.66024 3.69036 4.4526C3.898 4.24497 4.15356 4.14115 4.45703 4.14115H8.50599C8.50599 3.8217 8.60981 3.55816 8.81745 3.35052C9.02509 3.14288 9.28064 3.03906 9.58411 3.03906H13.4174C13.7209 3.03906 13.9765 3.14288 14.1841 3.35052C14.3918 3.55816 14.4956 3.8217 14.4956 4.14115H18.5445C18.848 4.14115 19.1036 4.24497 19.3112 4.4526C19.5188 4.66024 19.6227 4.9158 19.6227 5.21927C19.6227 5.52274 19.5188 5.78213 19.3112 5.99744C19.1036 6.21338 18.848 6.32135 18.5445 6.32135V18.6359C18.5445 19.2429 18.3289 19.7581 17.8977 20.1817C17.4664 20.6047 16.9553 20.8161 16.3643 20.8161H6.63724ZM6.63724 6.32135V18.6359H16.3643V6.32135H6.63724ZM8.52995 15.7609C8.52995 16.0484 8.62578 16.2922 8.81745 16.4921C9.00911 16.6915 9.2487 16.7911 9.5362 16.7911C9.8237 16.7911 10.0674 16.6915 10.2674 16.4921C10.4667 16.2922 10.5664 16.0484 10.5664 15.7609V9.19635C10.5664 8.90885 10.4667 8.66512 10.2674 8.46515C10.0674 8.26581 9.8237 8.16615 9.5362 8.16615C9.2487 8.16615 9.00911 8.26581 8.81745 8.46515C8.62578 8.66512 8.52995 8.90885 8.52995 9.19635V15.7609ZM12.4352 15.7609C12.4352 16.0484 12.5351 16.2922 12.7351 16.4921C12.9344 16.6915 13.1779 16.7911 13.4654 16.7911C13.7529 16.7911 13.9924 16.6915 14.1841 16.4921C14.3758 16.2922 14.4716 16.0484 14.4716 15.7609V9.19635C14.4716 8.90885 14.3758 8.66512 14.1841 8.46515C13.9924 8.26581 13.7529 8.16615 13.4654 8.16615C13.1779 8.16615 12.9344 8.26581 12.7351 8.46515C12.5351 8.66512 12.4352 8.90885 12.4352 9.19635V15.7609Z"
        fill={color}
      />
    </Svg>
  );
}
