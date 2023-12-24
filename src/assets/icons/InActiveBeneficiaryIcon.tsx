import { Path, Svg } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function InActiveBeneficiaryIcon({ color = "black", width = 24, height = 24 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M9.36156 5.10961C10.0716 4.00961 11.3116 3.28961 12.7116 3.28961C14.9216 3.28961 16.7116 5.07961 16.7116 7.28961C16.7116 8.68961 15.9916 9.92961 14.8916 10.6396L9.36156 5.10961ZM20.7116 16.4596C20.6916 15.3596 20.0816 14.3496 19.1016 13.8396C18.5616 13.5596 17.9716 13.2996 17.3316 13.0796L20.7116 16.4596ZM21.9016 20.4796L3.52156 2.09961L2.10156 3.50961L10.9916 12.3996C9.18156 12.6296 7.60156 13.1896 6.32156 13.8496C5.32156 14.3596 4.71156 15.3896 4.71156 16.5096V19.2896H17.8816L20.4916 21.8996L21.9016 20.4796Z"
        fill={color}
      />
    </Svg>
  );
}
