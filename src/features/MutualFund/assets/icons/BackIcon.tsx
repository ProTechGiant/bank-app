import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function BackIcon({ width = 36, height = 36, color = "#FAFAFA" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M16.725 25.3l-6.5-6.5a1.057 1.057 0 01-.25-.375A1.2 1.2 0 019.9 18c0-.15.025-.292.075-.425.05-.133.133-.258.25-.375l6.5-6.5c.217-.2.48-.304.788-.313.308-.008.579.096.812.313.233.217.354.483.363.8.008.317-.105.583-.338.8l-4.55 4.55h10.675c.317 0 .588.113.813.338.225.225.337.495.337.812 0 .317-.112.587-.337.812a1.108 1.108 0 01-.813.338H13.8l4.55 4.55c.217.2.33.463.338.788.008.325-.105.595-.338.812a1.087 1.087 0 01-.8.325c-.317 0-.592-.108-.825-.325z"
        fill={color}
      />
    </Svg>
  );
}
