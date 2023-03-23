import { Path, Svg } from "react-native-svg";

import { IconProps } from "./index";

export default function ThumbsUp({ width = 32, height = 32, color = "#CCCCCC" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M12.4609 17.5793C12.4183 20.0768 14.5218 21.9653 17.8264 21.9927L18.7858 21.9995C19.7096 22.0064 20.3919 21.9379 20.7756 21.8353C21.3299 21.7053 21.8629 21.3837 21.8629 20.7337C21.8629 20.4737 21.7919 20.2752 21.7066 20.1316C21.6497 20.0494 21.6569 19.9742 21.7492 19.94C22.1827 19.7689 22.5523 19.3652 22.5523 18.8315C22.5523 18.5168 22.4599 18.2499 22.2964 18.0583C22.2183 17.9557 22.2325 17.8667 22.3604 17.7915C22.6802 17.6136 22.9076 17.2304 22.9076 16.7856C22.9076 16.464 22.801 16.1288 22.6162 15.9645C22.4954 15.8687 22.5168 15.8003 22.6376 15.6977C22.8579 15.5198 23 15.2119 23 14.8219C23 14.165 22.467 13.6244 21.7635 13.6244L19.2619 13.6244C18.6294 13.6244 18.2102 13.3097 18.2102 12.8034C18.2102 11.8933 19.3898 10.2169 19.3898 9.01267C19.3898 8.36949 18.9706 8 18.4091 8C17.9046 8 17.6558 8.33528 17.3858 8.84846C16.3269 10.8259 14.9198 12.427 13.8467 13.8023C12.9371 14.9656 12.4893 15.9645 12.4609 17.5793ZM9 17.6272C9 19.6526 10.3218 21.3495 12.0772 21.3495L13.3279 21.3495C12.0487 20.4531 11.4802 19.0984 11.5086 17.5588C11.5299 15.8482 12.2193 14.6234 12.8376 13.8845L11.8142 13.8845C10.2294 13.8845 9 15.5266 9 17.6272Z"
        fill={color}
      />
    </Svg>
  );
}
