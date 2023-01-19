import { Image } from "react-native";

import LuxCardPlaceholder from "./lux-card-placeholder.png";
import StandardCardPlaceholder from "./standard-card-placeholder.png";

interface BankCardProps {
  height?: number | string;
  width?: number | string;
  variant: "standard" | "lux";
}

const ASPECT_RATIOS: Record<BankCardProps["variant"], number> = {
  standard: 1122 / 709,
  lux: 1122 / 709,
};

// @see https://www.figma.com/file/QOqqlaJOVnmvKjmRqIPryO/Croatia-Core-Theme?node-id=62%3A6229&t=WAwFBZPuGCq0uMIq-0
export default function BankCard({ variant, height, width }: BankCardProps) {
  if (__DEV__ && undefined === height && undefined === width)
    throw new Error("At least one of `height`, `width`, must be provided to BankCard");

  return (
    <Image
      resizeMode="contain"
      style={{ aspectRatio: ASPECT_RATIOS[variant], height, width }}
      source={variant === "standard" ? StandardCardPlaceholder : LuxCardPlaceholder}
    />
  );
}
