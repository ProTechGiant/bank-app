declare module "*.svg" {
  import * as React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

declare module "*.png" {
  import { ImageSourcePropType } from "react-native";
  const value: ImageSourcePropType;
  export default value;
}

declare namespace jest {
  interface Matchers<R, T = {}> {
    toBeInTheDocument: R;
  }
}

declare module "@env" {
  export const API_BASE_URL: string;
  export const API_TOKEN: string;
}
