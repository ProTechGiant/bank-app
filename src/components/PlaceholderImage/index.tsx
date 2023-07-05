import { Image, ImageProps } from "react-native";

import loadingPlaceholder from "./loading-placeholder.png";

type PlaceholderImageProps = Omit<ImageProps, "source">;

export default function PlaceholderImage({ ...restProps }: PlaceholderImageProps) {
  return <Image source={loadingPlaceholder} {...restProps} />;
}
