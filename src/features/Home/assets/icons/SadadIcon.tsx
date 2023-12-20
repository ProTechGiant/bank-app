import Svg, { Defs, Image, Path, Pattern, Use } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function SadadIcon({ width = 31, height = 9, color = "#fff" }: IconProps) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={width}
      height={height}
      viewBox="0 0 31 9"
      fill={color}>
      <Path d="M30.9844 0.725098H0.984375V8.7251H30.9844V0.725098Z" fill="url(#pattern0)" />
      <Defs>
        <Pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
          <Use xlinkHref="#image0_17121_42533" transform="scale(0.0166667 0.0625)" />
        </Pattern>
        <Image
          id="image0_17121_42533"
          width="60"
          height="16"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAQCAYAAABKkhw/AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGRSURBVHgB3VaBcYMwDBS9DJAR6AaMQCZoNog3aDZJOwHtBLABbBA2gA3CBqrcmMvjGmzu0obydzqEjHTyWxIm+gUw84VviGnNkA0q2GxJC8MT3R8voH/SmqHLl4fY0sJw7xNOQf+IoqijNUP3LJzunv4TJOFMpLHkLJK7Jq9Vzo1jXTliZfzHU3zjMpok1IhPIpLKN89WyR5Brxx+B5HYEUvbdhQIMxcS89pJDvWU3aylvqCK/VCWTwNribUWe2LFFL7h3JWD6G9gz0b2UmxG4mp2XKznIv3k7SBoSrfTa5FdAMbThJzgPWi4GWJwNlSg4+/wHfQD6AXNAY/coEwv/mB9Ik4K358pENZpZb54VmVdaA7E4RVLw1qbdZWcS5Dx2fKwbfa+eKKfbIIis4Cl6gIOBA09sFrjq+TRs12JfWfsMdinYlUUhoSG7VR74qG9Fdl956yZ4nlQmAWPD5EjLwO6+pKxhKdQ8vT0bRiukjwsv0ehZKvFIg7rodo1eflKQE9C0f+X+brxR9+0qr7tEF+Goqi5Y3bCZgAAAABJRU5ErkJggg=="
        />
      </Defs>
    </Svg>
  );
}
