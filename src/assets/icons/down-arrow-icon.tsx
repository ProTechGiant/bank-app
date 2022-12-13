import Svg, { Path } from "react-native-svg";

interface DownArrowIconProps {
  color?: string;
  width?: number | string;
  height?: number | string;
}

const DownArrowIcon = ({ width = 10, height = 10, color = "#FF7512" }: DownArrowIconProps) => (
  <Svg width={width} height={height} viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M7.00367 7.58231C7.28422 7.58231 7.51687 7.47967 7.73584 7.2607L12.8884 1.9918C13.0663 1.81389 13.1484 1.60176 13.1484 1.34858C13.1484 0.835375 12.7447 0.417969 12.2315 0.417969C11.9783 0.417969 11.7457 0.527452 11.5609 0.712206L7.01051 5.39263L2.44641 0.712206C2.26165 0.527452 2.03584 0.417968 1.77582 0.417968C1.26262 0.417968 0.852051 0.835375 0.852051 1.34858C0.852051 1.60176 0.941007 1.81389 1.11892 1.9918L6.27149 7.2607C6.49046 7.48651 6.72311 7.58231 7.00367 7.58231Z"
      fill={color}
    />
  </Svg>
);

export { DownArrowIcon };
