import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function SupportAgentIcon({ width = 24, height = 24, color = "#030311" }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15.45 11.0498C15.9 11.0498 16.2707 10.9038 16.562 10.6118C16.854 10.3205 17 9.9498 17 9.4998C17 9.0498 16.854 8.6788 16.562 8.3868C16.2707 8.09547 15.9 7.9498 15.45 7.9498C15 7.9498 14.6293 8.09547 14.338 8.3868C14.046 8.6788 13.9 9.0498 13.9 9.4998C13.9 9.9498 14.046 10.3205 14.338 10.6118C14.6293 10.9038 15 11.0498 15.45 11.0498ZM8.54999 11.0498C8.99999 11.0498 9.37099 10.9038 9.66299 10.6118C9.95432 10.3205 10.1 9.9498 10.1 9.4998C10.1 9.0498 9.95432 8.6788 9.66299 8.3868C9.37099 8.09547 8.99999 7.9498 8.54999 7.9498C8.09999 7.9498 7.72932 8.09547 7.43799 8.3868C7.14599 8.6788 6.99999 9.0498 6.99999 9.4998C6.99999 9.9498 7.14599 10.3205 7.43799 10.6118C7.72932 10.9038 8.09999 11.0498 8.54999 11.0498ZM12 17.4998C13.0333 17.4998 13.9583 17.2498 14.775 16.7498C15.5917 16.2498 16.2417 15.5915 16.725 14.7748C16.8583 14.5581 16.8667 14.3625 16.75 14.1878C16.6333 14.0125 16.4417 13.9248 16.175 13.9248H7.82499C7.55832 13.9248 7.36665 14.0125 7.24999 14.1878C7.13332 14.3625 7.14165 14.5581 7.27499 14.7748C7.75832 15.5915 8.40832 16.2498 9.22499 16.7498C10.0417 17.2498 10.9667 17.4998 12 17.4998ZM12 22.1998C10.5833 22.1998 9.25399 21.9331 8.01199 21.3998C6.77065 20.8665 5.69165 20.1415 4.77499 19.2248C3.85832 18.3081 3.13332 17.2291 2.59999 15.9878C2.06665 14.7458 1.79999 13.4165 1.79999 11.9998C1.79999 10.5831 2.06665 9.2538 2.59999 8.0118C3.13332 6.77047 3.85832 5.69147 4.77499 4.7748C5.69165 3.85814 6.77065 3.13314 8.01199 2.5998C9.25399 2.06647 10.5833 1.7998 12 1.7998C13.4167 1.7998 14.746 2.06647 15.988 2.5998C17.2293 3.13314 18.3083 3.85814 19.225 4.7748C20.1417 5.69147 20.8667 6.77047 21.4 8.0118C21.9333 9.2538 22.2 10.5831 22.2 11.9998C22.2 13.4165 21.9333 14.7458 21.4 15.9878C20.8667 17.2291 20.1417 18.3081 19.225 19.2248C18.3083 20.1415 17.2293 20.8665 15.988 21.3998C14.746 21.9331 13.4167 22.1998 12 22.1998ZM12 19.9248C14.2 19.9248 16.071 19.1541 17.613 17.6128C19.1543 16.0708 19.925 14.1998 19.925 11.9998C19.925 9.7998 19.1543 7.9288 17.613 6.3868C16.071 4.84547 14.2 4.0748 12 4.0748C9.79999 4.0748 7.92932 4.84547 6.38799 6.3868C4.84599 7.9288 4.07499 9.7998 4.07499 11.9998C4.07499 14.1998 4.84599 16.0708 6.38799 17.6128C7.92932 19.1541 9.79999 19.9248 12 19.9248Z"
        fill={color}
      />
    </Svg>
  );
}
