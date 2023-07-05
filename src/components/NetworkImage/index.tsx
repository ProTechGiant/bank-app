import { useEffect, useState } from "react";
import { Image, ImageProps, ImageURISource } from "react-native";

import { warn } from "@/logger";

import PlaceholderImage from "../PlaceholderImage";

interface NetworkImageProps extends Omit<ImageProps, "source"> {
  source: ImageURISource & { uri: string };
}

export default function NetworkImage({ source, ...restProps }: NetworkImageProps) {
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    Image.prefetch(source.uri)
      .then(() => {
        setIsSuccess(true);
      })
      .catch(error => {
        warn("network-image", "Could not render image", JSON.stringify(error));
      });
  }, [source]);

  return isSuccess ? <Image source={source} {...restProps} /> : <PlaceholderImage {...restProps} />;
}
