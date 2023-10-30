import Svg, { G, Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function ClockIcon({ width = 24, height = 24, color = "#EC5F48" }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none">
      <G id="history_toggle_off">
        <Path
          id="Vector"
          d="M15.1008 19.3698L16.1008 21.1098C15.1408 21.5498 14.0908 21.8398 13.0008 21.9498V19.9298C13.7408 19.8398 14.4408 19.6498 15.1008 19.3698ZM4.07078 12.9998H2.05078C2.16078 14.0998 2.45078 15.1398 2.89078 16.0998L4.63078 15.0998C4.35078 14.4398 4.16078 13.7398 4.07078 12.9998ZM15.1008 4.6298L16.1008 2.8898C15.1408 2.4498 14.1008 2.1598 13.0008 2.0498V4.0698C13.7408 4.1598 14.4408 4.3498 15.1008 4.6298ZM19.9308 10.9998H21.9508C21.8408 9.8998 21.5508 8.85981 21.1108 7.89981L19.3708 8.8998C19.6508 9.5598 19.8408 10.2598 19.9308 10.9998ZM8.90078 19.3698L7.90078 21.1098C8.86078 21.5498 9.91078 21.8398 11.0008 21.9498V19.9298C10.2608 19.8398 9.56078 19.6498 8.90078 19.3698ZM11.0008 4.0698V2.0498C9.90078 2.1598 8.86078 2.4498 7.90078 2.8898L8.90078 4.6298C9.56078 4.3498 10.2608 4.1598 11.0008 4.0698ZM18.3608 7.1698L20.1008 6.1598C19.4708 5.2898 18.7008 4.5198 17.8308 3.8898L16.8208 5.6298C17.4108 6.0798 17.9208 6.5898 18.3608 7.1698ZM4.63078 8.8998L2.89078 7.89981C2.45078 8.85981 2.16078 9.8998 2.05078 10.9998H4.07078C4.16078 10.2598 4.35078 9.5598 4.63078 8.8998ZM19.9308 12.9998C19.8408 13.7398 19.6508 14.4398 19.3708 15.0998L21.1108 16.0998C21.5508 15.1398 21.8408 14.0898 21.9508 12.9998H19.9308ZM16.8308 18.3598L17.8408 20.0998C18.7108 19.4698 19.4808 18.6998 20.1108 17.8298L18.3708 16.8198C17.9208 17.4098 17.4108 17.9198 16.8308 18.3598ZM7.17078 5.6398L6.17078 3.8898C5.29078 4.5298 4.53078 5.2898 3.90078 6.1698L5.64078 7.1798C6.08078 6.5898 6.59078 6.0798 7.17078 5.6398ZM5.64078 16.8298L3.90078 17.8298C4.53078 18.6998 5.30078 19.4698 6.17078 20.0998L7.18078 18.3598C6.59078 17.9198 6.08078 17.4098 5.64078 16.8298ZM13.0008 6.9998H11.0008V12.4098L15.2908 16.6998L16.7008 15.2898L13.0008 11.5898V6.9998Z"
          fill={color}
        />
      </G>
    </Svg>
  );
}
