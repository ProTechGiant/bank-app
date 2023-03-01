import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

const HideIcon = ({ width = 24, height = 24, color = "#CFCFDD" }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M12 5.97578C15.79 5.97578 19.17 8.10578 20.82 11.4758C20.23 12.6958 19.4 13.7458 18.41 14.5958L19.82 16.0058C21.21 14.7758 22.31 13.2358 23 11.4758C21.27 7.08578 17 3.97578 12 3.97578C10.73 3.97578 9.51 4.17578 8.36 4.54578L10.01 6.19578C10.66 6.06578 11.32 5.97578 12 5.97578ZM10.93 7.11578L13 9.18578C13.57 9.43578 14.03 9.89578 14.28 10.4658L16.35 12.5358C16.43 12.1958 16.49 11.8358 16.49 11.4658C16.5 8.98578 14.48 6.97578 12 6.97578C11.63 6.97578 11.28 7.02578 10.93 7.11578ZM2.01 3.84578L4.69 6.52578C3.06 7.80578 1.77 9.50578 1 11.4758C2.73 15.8658 7 18.9758 12 18.9758C13.52 18.9758 14.98 18.6858 16.32 18.1558L19.74 21.5758L21.15 20.1658L3.42 2.42578L2.01 3.84578ZM9.51 11.3458L12.12 13.9558C12.08 13.9658 12.04 13.9758 12 13.9758C10.62 13.9758 9.5 12.8558 9.5 11.4758C9.5 11.4258 9.51 11.3958 9.51 11.3458ZM6.11 7.94578L7.86 9.69578C7.63 10.2458 7.5 10.8458 7.5 11.4758C7.5 13.9558 9.52 15.9758 12 15.9758C12.63 15.9758 13.23 15.8458 13.77 15.6158L14.75 16.5958C13.87 16.8358 12.95 16.9758 12 16.9758C8.21 16.9758 4.83 14.8458 3.18 11.4758C3.88 10.0458 4.9 8.86578 6.11 7.94578Z"
      fill={color}
    />
  </Svg>
);

export { HideIcon };
