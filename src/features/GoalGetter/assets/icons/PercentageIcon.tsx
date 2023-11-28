import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function PercentageIcon({ width = 24, height = 25, color = "#1E1A25" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M7.35 11.5883C6.33333 11.5883 5.45833 11.2216 4.725 10.4883C3.99167 9.75495 3.625 8.87161 3.625 7.83828C3.625 6.82161 3.99167 5.94661 4.725 5.21328C5.45833 4.47995 6.34167 4.11328 7.375 4.11328C8.39167 4.11328 9.26667 4.47995 10 5.21328C10.7333 5.94661 11.1 6.82995 11.1 7.86328C11.1 8.87995 10.7333 9.75495 10 10.4883C9.26667 11.2216 8.38333 11.5883 7.35 11.5883ZM7.375 9.31328C7.775 9.31328 8.11667 9.17161 8.4 8.88828C8.68333 8.60495 8.825 8.25495 8.825 7.83828C8.825 7.43828 8.68333 7.09661 8.4 6.81328C8.11667 6.52995 7.775 6.38828 7.375 6.38828C6.95833 6.38828 6.60833 6.52995 6.325 6.81328C6.04167 7.09661 5.9 7.43828 5.9 7.83828C5.9 8.25495 6.04167 8.60495 6.325 8.88828C6.60833 9.17161 6.95833 9.31328 7.375 9.31328ZM16.625 20.8633C15.6083 20.8633 14.7333 20.4966 14 19.7633C13.2667 19.0299 12.9 18.1466 12.9 17.1133C12.9 16.0966 13.2667 15.2216 14 14.4883C14.7333 13.7549 15.6167 13.3883 16.65 13.3883C17.6667 13.3883 18.5417 13.7549 19.275 14.4883C20.0083 15.2216 20.375 16.1049 20.375 17.1383C20.375 18.1549 20.0083 19.0299 19.275 19.7633C18.5417 20.4966 17.6583 20.8633 16.625 20.8633ZM16.65 18.5883C17.05 18.5883 17.3917 18.4466 17.675 18.1633C17.9583 17.8799 18.1 17.5299 18.1 17.1133C18.1 16.7133 17.9583 16.3716 17.675 16.0883C17.3917 15.8049 17.05 15.6633 16.65 15.6633C16.2333 15.6633 15.8833 15.8049 15.6 16.0883C15.3167 16.3716 15.175 16.7133 15.175 17.1133C15.175 17.5299 15.3167 17.8799 15.6 18.1633C15.8833 18.4466 16.2333 18.5883 16.65 18.5883ZM4.6 19.8883C4.38333 19.6716 4.275 19.4049 4.275 19.0883C4.275 18.7716 4.38333 18.5049 4.6 18.2883L17.8 5.08828C18.0167 4.87161 18.2833 4.76328 18.6 4.76328C18.9167 4.76328 19.1833 4.87161 19.4 5.08828C19.6167 5.30495 19.725 5.57161 19.725 5.88828C19.725 6.20495 19.6167 6.47161 19.4 6.68828L6.2 19.8883C5.98333 20.1049 5.71667 20.2133 5.4 20.2133C5.08333 20.2133 4.81667 20.1049 4.6 19.8883Z"
        fill={color}
      />
    </Svg>
  );
}
