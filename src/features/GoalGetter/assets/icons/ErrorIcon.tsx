import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function ErrorIcon({ width = 20, height = 20, color = "#1E1A25" }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10 10.8333C10.2639 10.8333 10.4894 10.7431 10.6767 10.5625C10.8644 10.3819 10.9583 10.1597 10.9583 9.89583V6.64583C10.9583 6.38194 10.8644 6.16333 10.6767 5.99C10.4894 5.81611 10.2639 5.72917 10 5.72917C9.73611 5.72917 9.51056 5.81944 9.32333 6C9.13556 6.18056 9.04167 6.40278 9.04167 6.66667V9.91667C9.04167 10.1806 9.13556 10.3994 9.32333 10.5733C9.51056 10.7467 9.73611 10.8333 10 10.8333ZM10 14.3333C10.2778 14.3333 10.5106 14.2394 10.6983 14.0517C10.8856 13.8644 10.9792 13.6319 10.9792 13.3542C10.9792 13.0764 10.8856 12.8439 10.6983 12.6567C10.5106 12.4689 10.2778 12.375 10 12.375C9.72222 12.375 9.48972 12.4689 9.3025 12.6567C9.11472 12.8439 9.02083 13.0764 9.02083 13.3542C9.02083 13.6319 9.11472 13.8644 9.3025 14.0517C9.48972 14.2394 9.72222 14.3333 10 14.3333ZM10 18.5C8.81944 18.5 7.71167 18.2778 6.67667 17.8333C5.64222 17.3889 4.74306 16.7847 3.97917 16.0208C3.21528 15.2569 2.61111 14.3578 2.16667 13.3233C1.72222 12.2883 1.5 11.1806 1.5 10C1.5 8.81944 1.72222 7.71167 2.16667 6.67667C2.61111 5.64222 3.21528 4.74306 3.97917 3.97917C4.74306 3.21528 5.64222 2.61111 6.67667 2.16667C7.71167 1.72222 8.81944 1.5 10 1.5C11.1806 1.5 12.2883 1.72222 13.3233 2.16667C14.3578 2.61111 15.2569 3.21528 16.0208 3.97917C16.7847 4.74306 17.3889 5.64222 17.8333 6.67667C18.2778 7.71167 18.5 8.81944 18.5 10C18.5 11.1806 18.2778 12.2883 17.8333 13.3233C17.3889 14.3578 16.7847 15.2569 16.0208 16.0208C15.2569 16.7847 14.3578 17.3889 13.3233 17.8333C12.2883 18.2778 11.1806 18.5 10 18.5ZM10 16.6042C11.8333 16.6042 13.3925 15.9619 14.6775 14.6775C15.9619 13.3925 16.6042 11.8333 16.6042 10C16.6042 8.16667 15.9619 6.6075 14.6775 5.3225C13.3925 4.03806 11.8333 3.39583 10 3.39583C8.16667 3.39583 6.60778 4.03806 5.32333 5.3225C4.03833 6.6075 3.39583 8.16667 3.39583 10C3.39583 11.8333 4.03833 13.3925 5.32333 14.6775C6.60778 15.9619 8.16667 16.6042 10 16.6042Z"
        fill={color}
      />
    </Svg>
  );
}
