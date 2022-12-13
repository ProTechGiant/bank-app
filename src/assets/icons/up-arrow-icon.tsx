import Svg, { Path } from "react-native-svg";

interface UpArrowIconProps {
  color?: string;
  width?: number | string;
  height?: number | string;
}

const UpArrowIcon = ({ width = 10, height = 10, color = "#FF7512" }: UpArrowIconProps) => (
  <Svg width={width} height={height} viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M6.99633 0.417692C6.71578 0.417692 6.48313 0.520333 6.26416 0.7393L1.11159 6.0082C0.933675 6.18611 0.851563 6.39824 0.851563 6.65142C0.851563 7.16462 1.25528 7.58203 1.76849 7.58203C2.02167 7.58203 2.25432 7.47255 2.43908 7.28779L6.98949 2.60737L11.5536 7.28779C11.7383 7.47255 11.9642 7.58203 12.2242 7.58203C12.7374 7.58203 13.1479 7.16462 13.1479 6.65142C13.1479 6.39824 13.059 6.18611 12.8811 6.0082L7.72851 0.7393C7.50954 0.51349 7.27689 0.417692 6.99633 0.417692Z"
      fill={color}
    />
  </Svg>
);

export { UpArrowIcon };
