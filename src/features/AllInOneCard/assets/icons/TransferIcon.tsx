import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function TransferIcon({ width = 20, height = 20 }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 20 20" fill="none">
      <Path
        d="M2.91667 8.74935C2.91667 10.791 4.38333 12.4743 6.31667 12.841L5.075 11.5993L6.25 10.416L9.58333 13.7577L6.25 17.0827L5.075 15.9077L6.39167 14.591V14.541C3.5 14.1994 1.25 11.7327 1.25 8.74935C1.25 5.52435 3.85833 2.91602 7.08333 2.91602H9.58333V4.58268H7.08333C4.78333 4.58268 2.91667 6.44935 2.91667 8.74935Z"
        fill="#F5F9FA"
      />
      <Path
        d="M18.75 8.74935V2.91602H11.25V8.74935H18.75ZM17.0833 7.08268H12.9167V4.58268H17.0833V7.08268Z"
        fill="#F5F9FA"
      />
      <Path d="M18.75 10.416H11.25V16.2493H18.75V10.416Z" fill="#F5F9FA" />
    </Svg>
  );
}
