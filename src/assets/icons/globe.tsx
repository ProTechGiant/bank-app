import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

const GlobeIcon = ({ width = 24, height = 24, color = "#080E53" }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M21.41 8.64013C21.41 8.64013 21.41 8.64013 21.41 8.59013C20.7054 6.66635 19.4269 5.00541 17.7475 3.83199C16.0681 2.65857 14.0687 2.0293 12.02 2.0293C9.97125 2.0293 7.97193 2.65857 6.29251 3.83199C4.61308 5.00541 3.3346 6.66635 2.63 8.59013C2.63 8.59013 2.63 8.59013 2.63 8.64013C1.84312 10.811 1.84312 13.1892 2.63 15.3601C2.63 15.3601 2.63 15.3601 2.63 15.4101C3.3346 17.3339 4.61308 18.9948 6.29251 20.1683C7.97193 21.3417 9.97125 21.971 12.02 21.971C14.0687 21.971 16.0681 21.3417 17.7475 20.1683C19.4269 18.9948 20.7054 17.3339 21.41 15.4101C21.41 15.4101 21.41 15.4101 21.41 15.3601C22.1969 13.1892 22.1969 10.811 21.41 8.64013ZM4.26 14.0001C3.91322 12.6893 3.91322 11.3109 4.26 10.0001H6.12C5.96003 11.3287 5.96003 12.6716 6.12 14.0001H4.26ZM5.08 16.0001H6.48C6.71472 16.892 7.05021 17.7542 7.48 18.5701C6.4993 17.9021 5.67949 17.0242 5.08 16.0001ZM6.48 8.00013H5.08C5.67087 6.97921 6.48019 6.10159 7.45 5.43013C7.03055 6.24737 6.70514 7.10954 6.48 8.00013ZM11 19.7001C9.77176 18.7988 8.90915 17.4854 8.57 16.0001H11V19.7001ZM11 14.0001H8.14C7.95339 12.6733 7.95339 11.3269 8.14 10.0001H11V14.0001ZM11 8.00013H8.57C8.90915 6.51489 9.77176 5.20144 11 4.30013V8.00013ZM18.92 8.00013H17.52C17.2853 7.10828 16.9498 6.24606 16.52 5.43013C17.5007 6.0982 18.3205 6.97607 18.92 8.00013ZM13 4.30013C14.2282 5.20144 15.0908 6.51489 15.43 8.00013H13V4.30013ZM13 19.7001V16.0001H15.43C15.0908 17.4854 14.2282 18.7988 13 19.7001ZM15.86 14.0001H13V10.0001H15.86C16.0466 11.3269 16.0466 12.6733 15.86 14.0001ZM16.55 18.5701C16.9798 17.7542 17.3153 16.892 17.55 16.0001H18.95C18.3505 17.0242 17.5307 17.9021 16.55 18.5701ZM19.74 14.0001H17.88C17.9613 13.3366 18.0014 12.6686 18 12.0001C18.0011 11.3316 17.961 10.6637 17.88 10.0001H19.74C20.0868 11.3109 20.0868 12.6893 19.74 14.0001Z"
      fill={color}
    />
  </Svg>
);

export { GlobeIcon };
