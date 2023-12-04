import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function NativeShareIcon({ width = 37, height = 36, color = "white" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 37 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M23.4758 28.1752C22.5924 28.1752 21.8424 27.8669 21.2258 27.2502C20.6091 26.6335 20.3008 25.8835 20.3008 25.0002C20.3008 24.8835 20.3091 24.7585 20.3258 24.6252C20.3424 24.4919 20.3674 24.3752 20.4008 24.2752L13.6258 20.3502C13.3424 20.6002 13.0134 20.8002 12.6388 20.9502C12.2634 21.1002 11.8758 21.1752 11.4758 21.1752C10.5924 21.1752 9.84245 20.8669 9.22578 20.2502C8.60911 19.6335 8.30078 18.8835 8.30078 18.0002C8.30078 17.1169 8.60911 16.3669 9.22578 15.7502C9.84245 15.1335 10.5924 14.8252 11.4758 14.8252C11.8758 14.8252 12.2634 14.9002 12.6388 15.0502C13.0134 15.2002 13.3424 15.4002 13.6258 15.6502L20.4008 11.7252C20.3674 11.6252 20.3424 11.5085 20.3258 11.3752C20.3091 11.2419 20.3008 11.1169 20.3008 11.0002C20.3008 10.1169 20.6091 9.36686 21.2258 8.7502C21.8424 8.13353 22.5924 7.8252 23.4758 7.8252C24.3591 7.8252 25.1091 8.13353 25.7258 8.7502C26.3424 9.36686 26.6508 10.1169 26.6508 11.0002C26.6508 11.8835 26.3424 12.6335 25.7258 13.2502C25.1091 13.8669 24.3591 14.1752 23.4758 14.1752C23.0758 14.1752 22.6884 14.1042 22.3138 13.9622C21.9384 13.8209 21.6091 13.6169 21.3258 13.3502L14.5508 17.2752C14.5841 17.3752 14.6091 17.4919 14.6258 17.6252C14.6424 17.7585 14.6508 17.8835 14.6508 18.0002C14.6508 18.1169 14.6424 18.2419 14.6258 18.3752C14.6091 18.5085 14.5841 18.6252 14.5508 18.7252L21.3258 22.6502C21.6091 22.3835 21.9384 22.1795 22.3138 22.0382C22.6884 21.8962 23.0758 21.8252 23.4758 21.8252C24.3591 21.8252 25.1091 22.1335 25.7258 22.7502C26.3424 23.3669 26.6508 24.1169 26.6508 25.0002C26.6508 25.8835 26.3424 26.6335 25.7258 27.2502C25.1091 27.8669 24.3591 28.1752 23.4758 28.1752ZM23.4758 12.0002C23.7591 12.0002 23.9964 11.9045 24.1878 11.7132C24.3798 11.5212 24.4758 11.2835 24.4758 11.0002C24.4758 10.7169 24.3798 10.4792 24.1878 10.2872C23.9964 10.0959 23.7591 10.0002 23.4758 10.0002C23.1924 10.0002 22.9551 10.0959 22.7638 10.2872C22.5718 10.4792 22.4758 10.7169 22.4758 11.0002C22.4758 11.2835 22.5718 11.5212 22.7638 11.7132C22.9551 11.9045 23.1924 12.0002 23.4758 12.0002ZM11.4758 19.0002C11.7591 19.0002 11.9968 18.9042 12.1888 18.7122C12.3801 18.5209 12.4758 18.2835 12.4758 18.0002C12.4758 17.7169 12.3801 17.4792 12.1888 17.2872C11.9968 17.0959 11.7591 17.0002 11.4758 17.0002C11.1924 17.0002 10.9548 17.0959 10.7628 17.2872C10.5714 17.4792 10.4758 17.7169 10.4758 18.0002C10.4758 18.2835 10.5714 18.5209 10.7628 18.7122C10.9548 18.9042 11.1924 19.0002 11.4758 19.0002ZM23.4758 26.0002C23.7591 26.0002 23.9964 25.9042 24.1878 25.7122C24.3798 25.5209 24.4758 25.2835 24.4758 25.0002C24.4758 24.7169 24.3798 24.4795 24.1878 24.2882C23.9964 24.0962 23.7591 24.0002 23.4758 24.0002C23.1924 24.0002 22.9551 24.0962 22.7638 24.2882C22.5718 24.4795 22.4758 24.7169 22.4758 25.0002C22.4758 25.2835 22.5718 25.5209 22.7638 25.7122C22.9551 25.9042 23.1924 26.0002 23.4758 26.0002Z"
        fill={color}
      />
    </Svg>
  );
}
