import { Path, Svg } from "react-native-svg";

import { IconProps } from "./index";

export default function ThumbsUp({ width = 18, height = 18, color = "#2E2E2E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M15.75 6.75H11.0175L11.73 3.3225L11.7525 3.0825C11.7525 2.775 11.625 2.49 11.4225 2.2875L10.6275 1.5L5.6925 6.4425C5.415 6.7125 5.25 7.0875 5.25 7.5V15C5.25 15.825 5.925 16.5 6.75 16.5H13.5C14.1225 16.5 14.655 16.125 14.88 15.585L17.145 10.2975C17.2125 10.125 17.25 9.945 17.25 9.75V8.25C17.25 7.425 16.575 6.75 15.75 6.75ZM15.75 9.75L13.5 15H6.75V7.5L10.005 4.245L9.1725 8.25H15.75V9.75ZM0.75 7.5H3.75V16.5H0.75V7.5Z"
        fill={color}
      />
    </Svg>
  );
}
