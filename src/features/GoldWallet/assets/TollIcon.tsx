import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function TollIcon({ width = 17, height = 17, color = "#423D4A" }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 17 17" fill="none">
      <Path
        d="M10.6257 2.8335C7.49482 2.8335 4.95898 5.36933 4.95898 8.50016C4.95898 11.631 7.49482 14.1668 10.6257 14.1668C13.7565 14.1668 16.2923 11.631 16.2923 8.50016C16.2923 5.36933 13.7565 2.8335 10.6257 2.8335ZM10.6257 12.7502C8.28107 12.7502 6.37565 10.8447 6.37565 8.50016C6.37565 6.15558 8.28107 4.25016 10.6257 4.25016C12.9702 4.25016 14.8757 6.15558 14.8757 8.50016C14.8757 10.8447 12.9702 12.7502 10.6257 12.7502ZM2.12565 8.50016C2.12565 6.65141 3.30857 5.07891 4.95898 4.49808V3.01766C2.51523 3.64808 0.708984 5.85808 0.708984 8.50016C0.708984 11.1422 2.51523 13.3522 4.95898 13.9827V12.5022C3.30857 11.9214 2.12565 10.3489 2.12565 8.50016Z"
        fill={color}
      />
    </Svg>
  );
}
