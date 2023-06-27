import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function EditBorderedIcon({ width = 21, height = 21, color = "#080E53" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M18.7156 18.7486C18.7156 19.1625 18.3781 19.4986 17.9634 19.4986H3.14524C2.73053 19.4986 2.39305 19.1625 2.39305 18.7486V3.97278C2.39305 3.55892 2.73053 3.22274 3.14524 3.22274H11.878C12.0856 3.22274 12.2737 3.13886 12.4099 3.00308C12.5459 2.86747 12.6301 2.67996 12.6301 2.4727C12.6301 2.05816 12.2933 1.72266 11.878 1.72266H3.14524C1.90095 1.72266 0.888672 2.73204 0.888672 3.97278V18.7486C0.888672 19.9893 1.90095 20.9987 3.14524 20.9987H17.9634C19.2077 20.9987 20.22 19.9893 20.22 18.7486V10.0404C20.22 9.62587 19.8832 9.29036 19.4678 9.29036C19.2599 9.29036 19.0719 9.3744 18.9357 9.51018C18.7997 9.64579 18.7156 9.83313 18.7156 10.0404L18.7156 18.7486Z"
        fill={color}
      />
      <Path
        d="M7.27664 10.3838L6.02646 14.956C5.95561 15.2154 6.02931 15.4929 6.22038 15.6833C6.36326 15.8261 6.55534 15.9032 6.75212 15.9032C6.81827 15.9032 6.88476 15.8943 6.95007 15.8769L11.5354 14.6303C11.6619 14.5958 11.7767 14.5291 11.8692 14.4369L21.0403 5.29195C22.2527 4.08267 22.2527 2.11534 21.0403 0.906141C19.827 -0.302454 17.8546 -0.30164 16.642 0.906141L7.47083 10.0506C7.37815 10.1429 7.31132 10.2579 7.2769 10.3838L7.27664 10.3838ZM19.9762 1.96662C20.602 2.59061 20.602 3.60732 19.9762 4.23131L19.4495 4.75651L17.1783 2.49165L17.705 1.96662C18.3308 1.34263 19.3496 1.34263 19.9762 1.96662ZM16.1148 3.55225L18.386 5.81711L10.9462 13.2357L7.82376 14.0847L8.6752 10.971L16.1148 3.55225Z"
        fill={color}
      />
    </Svg>
  );
}
