import Svg, { Path, Rect } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

const EditGoalIcon = ({ width = 36, height = 36, color = "#2E2E2E" }: IconProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Rect width={width} height={height} rx={18} fill="#FAFAFA" fillOpacity={0.6} />
      <Path
        d="M8.99805 27.0013H12.748L23.808 15.9413L20.058 12.1913L8.99805 23.2513V27.0013ZM10.998 24.0813L20.058 15.0213L20.978 15.9413L11.918 25.0013H10.998V24.0813Z"
        fill={color}
      />
      <Path
        d="M24.368 9.29128C23.978 8.90128 23.348 8.90128 22.958 9.29128L21.128 11.1213L24.878 14.8713L26.708 13.0413C27.098 12.6513 27.098 12.0213 26.708 11.6313L24.368 9.29128Z"
        fill={color}
      />
    </Svg>
  );
};

export default EditGoalIcon;
