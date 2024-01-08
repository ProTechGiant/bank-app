import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function SpendingInsightIcon({ width = 25, height = 25, color = "#39FDDC" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M6.86523 20.9802C6.2819 20.9802 5.7819 20.7718 5.36523 20.3552C4.94857 19.9385 4.74023 19.4385 4.74023 18.8552V11.8052C4.74023 11.2218 4.94857 10.7218 5.36523 10.3052C5.7819 9.88851 6.2819 9.68018 6.86523 9.68018C7.44857 9.68018 7.94857 9.88851 8.36523 10.3052C8.7819 10.7218 8.99023 11.2218 8.99023 11.8052V18.8552C8.99023 19.4385 8.7819 19.9385 8.36523 20.3552C7.94857 20.7718 7.44857 20.9802 6.86523 20.9802ZM12.8652 20.9802C12.2819 20.9802 11.7819 20.7718 11.3652 20.3552C10.9486 19.9385 10.7402 19.4385 10.7402 18.8552V6.80518C10.7402 6.22184 10.9486 5.72184 11.3652 5.30518C11.7819 4.88851 12.2819 4.68018 12.8652 4.68018C13.4486 4.68018 13.9486 4.88851 14.3652 5.30518C14.7819 5.72184 14.9902 6.22184 14.9902 6.80518V18.8552C14.9902 19.4385 14.7819 19.9385 14.3652 20.3552C13.9486 20.7718 13.4486 20.9802 12.8652 20.9802ZM18.8652 20.9802C18.2819 20.9802 17.7819 20.7718 17.3652 20.3552C16.9486 19.9385 16.7402 19.4385 16.7402 18.8552V15.8052C16.7402 15.2218 16.9486 14.7218 17.3652 14.3052C17.7819 13.8885 18.2819 13.6802 18.8652 13.6802C19.4486 13.6802 19.9486 13.8885 20.3652 14.3052C20.7819 14.7218 20.9902 15.2218 20.9902 15.8052V18.8552C20.9902 19.4385 20.7819 19.9385 20.3652 20.3552C19.9486 20.7718 19.4486 20.9802 18.8652 20.9802Z"
        fill={color}
      />
    </Svg>
  );
}
