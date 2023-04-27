import Svg, { G, Path, Rect } from "react-native-svg";

interface HeaderBackgroundProps {
  deviceWidth: number;
  scaledHeight: number;
  scaleFactor: number;
}

const HeaderBackground = ({ deviceWidth, scaleFactor, scaledHeight }: HeaderBackgroundProps) => {
  return (
    <Svg width={deviceWidth} height={scaledHeight} fill="none">
      <G transform={`scale(${scaleFactor})`}>
        <Rect width="390" height="495" fill="#002233" />
        <G transform="translate(0, -50)">
          <Path d="M313.821 -69.4571L-161.794 -43.7164L-31.5206 180.407L313.821 -69.4571Z" fill="#00334C" />
          <Path d="M202.314 553.362L-135.511 498.952L-78.2087 676.15L202.314 553.362Z" fill="#F34C33" />
          <Path d="M393.01 313.327L289.27 639.402L472.991 608.917L393.01 313.327Z" fill="#00334C" />
        </G>
      </G>
    </Svg>
  );
};

export default HeaderBackground;
