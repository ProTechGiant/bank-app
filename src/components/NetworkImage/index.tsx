import { useEffect, useState } from "react";
import { Image, ImageProps, ImageURISource } from "react-native";

import { warn } from "@/logger";

import loadingPlaceholder from "./loading-placeholder.png";

interface NetworkImageProps extends Omit<ImageProps, "source"> {
  source: ImageURISource & { uri: string };
}

export default function NetworkImage({ source, ...restProps }: NetworkImageProps) {
  const [image, setImage] = useState<ImageProps["source"]>(loadingPlaceholder);

  useEffect(() => {
    Image.prefetch(source.uri)
      .then(() => {
        setImage(source);
      })
      .catch(error => {
        warn("network-image", "Could not render image", JSON.stringify(error));
      });
  }, [source]);

  return <Image source={image} {...restProps} />;
}
