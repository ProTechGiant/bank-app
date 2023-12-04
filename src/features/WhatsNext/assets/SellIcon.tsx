import Svg, { Path } from "react-native-svg";

import { IconProps } from "@/assets/icons/index";

export default function SellIcon({ width = 24, height = 24, color = "#1E1A25" }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12.8496 22.2746C12.5329 22.2746 12.2329 22.2119 11.9496 22.0866C11.6663 21.9619 11.4163 21.7996 11.1996 21.5996L2.39961 12.7996C2.19961 12.5829 2.03728 12.3329 1.91261 12.0496C1.78728 11.7663 1.72461 11.4663 1.72461 11.1496V3.99961C1.72461 3.36628 1.94561 2.82861 2.38761 2.38661C2.82894 1.94528 3.36628 1.72461 3.99961 1.72461H11.1496C11.4663 1.72461 11.7663 1.78694 12.0496 1.91161C12.3329 2.03694 12.5829 2.19961 12.7996 2.39961L21.5996 11.2246C22.0329 11.6579 22.2496 12.1913 22.2496 12.8246C22.2496 13.4579 22.0329 13.9996 21.5996 14.4496L14.4496 21.5996C14.2329 21.7996 13.9873 21.9619 13.7126 22.0866C13.4373 22.2119 13.1496 22.2746 12.8496 22.2746ZM6.49961 7.99961C6.91628 7.99961 7.27028 7.85361 7.56161 7.56161C7.85361 7.27028 7.99961 6.91628 7.99961 6.49961C7.99961 6.08294 7.85361 5.72894 7.56161 5.43761C7.27028 5.14561 6.91628 4.99961 6.49961 4.99961C6.08294 4.99961 5.72894 5.14561 5.43761 5.43761C5.14561 5.72894 4.99961 6.08294 4.99961 6.49961C4.99961 6.91628 5.14561 7.27028 5.43761 7.56161C5.72894 7.85361 6.08294 7.99961 6.49961 7.99961Z"
        fill={color}
      />
    </Svg>
  );
}
