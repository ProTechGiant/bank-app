import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function PendingIcon({ width = 20, height = 21, color = "#00A0CC" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M9.9915 2.4165C5.3915 2.4165 1.6665 6.14984 1.6665 10.7498C1.6665 15.3498 5.3915 19.0832 9.9915 19.0832C14.5998 19.0832 18.3332 15.3498 18.3332 10.7498C18.3332 6.14984 14.5998 2.4165 9.9915 2.4165ZM9.99984 17.4165C6.3165 17.4165 3.33317 14.4332 3.33317 10.7498C3.33317 7.0665 6.3165 4.08317 9.99984 4.08317C13.6832 4.08317 16.6665 7.0665 16.6665 10.7498C16.6665 14.4332 13.6832 17.4165 9.99984 17.4165ZM10.4165 6.58317H9.1665V11.5832L13.5415 14.2082L14.1665 13.1832L10.4165 10.9582V6.58317Z"
        fill={color}
      />
    </Svg>
  );
}
