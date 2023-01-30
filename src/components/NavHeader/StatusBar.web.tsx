import { Path, Svg } from "react-native-svg";

// Shim to show a StatusBar on Storybook
export default function StatusBar() {
  return (
    <Svg width={window.innerWidth} height="37" viewBox="0 0 390 37" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M117 0H273V16C273 25.3888 265.389 33 256 33H134C124.611 33 117 25.3888 117 16V0Z" fill="black" />
      <Path
        d="M41.8786 21.7231C39.2805 21.7231 37.4294 23.4995 37.4294 25.9316V25.9482C37.4294 28.2227 39.0397 29.8994 41.3391 29.8994C42.9826 29.8994 44.0285 29.061 44.4684 28.1147H44.6345C44.6345 28.2061 44.6262 28.2974 44.6262 28.3887C44.5349 30.6797 43.7297 32.5391 41.8288 32.5391C40.7746 32.5391 40.0358 31.9912 39.7204 31.1528L39.6955 31.0698H37.5871L37.6037 31.1611C37.9855 32.9956 39.6291 34.2988 41.8288 34.2988C44.842 34.2988 46.6599 31.9082 46.6599 27.874V27.8574C46.6599 23.541 44.4352 21.7231 41.8786 21.7231ZM41.8703 28.2559C40.509 28.2559 39.5212 27.2598 39.5212 25.8735V25.8569C39.5212 24.5205 40.5754 23.4663 41.8952 23.4663C43.2233 23.4663 44.2609 24.5371 44.2609 25.9067V25.9233C44.2609 27.2764 43.2233 28.2559 41.8703 28.2559ZM50.0204 26.2388C50.7841 26.2388 51.3402 25.6577 51.3402 24.9272C51.3402 24.1885 50.7841 23.6157 50.0204 23.6157C49.265 23.6157 48.7006 24.1885 48.7006 24.9272C48.7006 25.6577 49.265 26.2388 50.0204 26.2388ZM50.0204 32.3979C50.7841 32.3979 51.3402 31.8252 51.3402 31.0864C51.3402 30.3477 50.7841 29.7749 50.0204 29.7749C49.265 29.7749 48.7006 30.3477 48.7006 31.0864C48.7006 31.8252 49.265 32.3979 50.0204 32.3979ZM59.1915 34H61.2418V31.7007H62.8522V29.9326H61.2418V22.022H58.212C56.5851 24.4956 54.8834 27.2515 53.3312 29.9492V31.7007H59.1915V34ZM55.3233 29.9824V29.8579C56.4855 27.8242 57.8717 25.6079 59.1002 23.7319H59.2247V29.9824H55.3233ZM67.408 34H69.5496V22.022H67.4163L64.2869 24.2217V26.2388L67.2669 24.1304H67.408V34Z"
        fill="black"
      />
      <Path
        opacity="0.35"
        d="M336.5 25C336.5 23.067 338.067 21.5 340 21.5H357C358.933 21.5 360.5 23.067 360.5 25V30C360.5 31.933 358.933 33.5 357 33.5H340C338.067 33.5 336.5 31.933 336.5 30V25Z"
        stroke="black"
      />
      <Path
        opacity="0.4"
        d="M362 26V30.2203C362.849 29.8629 363.401 29.0314 363.401 28.1102C363.401 27.1889 362.849 26.3574 362 26Z"
        fill="black"
      />
      <Path
        d="M338 25C338 23.8954 338.895 23 340 23H357C358.105 23 359 23.8954 359 25V30C359 31.1046 358.105 32 357 32H340C338.895 32 338 31.1046 338 30V25Z"
        fill="black"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M320.5 24.5875C322.967 24.5876 325.339 25.5551 327.127 27.2898C327.261 27.4237 327.477 27.4221 327.609 27.286L328.896 25.9604C328.963 25.8915 329.001 25.798 329 25.7008C328.999 25.6035 328.961 25.5105 328.893 25.4423C324.201 20.8526 316.799 20.8526 312.107 25.4423C312.039 25.5105 312.001 25.6034 312 25.7007C311.999 25.7979 312.037 25.8914 312.104 25.9604L313.391 27.286C313.523 27.4223 313.739 27.424 313.873 27.2898C315.661 25.5549 318.034 24.5875 320.5 24.5875ZM320.536 28.5894C321.891 28.5893 323.198 29.1035 324.203 30.032C324.338 30.1638 324.552 30.1609 324.685 30.0255L325.97 28.7C326.038 28.6304 326.075 28.5361 326.074 28.4381C326.073 28.3401 326.034 28.2466 325.965 28.1784C322.906 25.2739 318.169 25.2739 315.109 28.1784C315.04 28.2466 315.001 28.3401 315 28.4382C314.999 28.5362 315.037 28.6305 315.105 28.7L316.39 30.0255C316.522 30.1609 316.736 30.1638 316.872 30.032C317.876 29.1041 319.182 28.5899 320.536 28.5894ZM323.15 31.1767C323.152 31.275 323.114 31.3698 323.045 31.4386L320.822 33.7289C320.756 33.7962 320.668 33.834 320.575 33.834C320.482 33.834 320.393 33.7962 320.328 33.7289L318.105 31.4386C318.036 31.3697 317.998 31.2749 318 31.1766C318.002 31.0783 318.044 30.9853 318.115 30.9194C319.535 29.6935 321.615 29.6935 323.035 30.9194C323.106 30.9853 323.148 31.0784 323.15 31.1767Z"
        fill="black"
      />
      <Path
        d="M296 25C296 24.4477 296.448 24 297 24H298C298.552 24 299 24.4477 299 25V33C299 33.5523 298.552 34 298 34H297C296.448 34 296 33.5523 296 33V25Z"
        fill="black"
      />
      <Path
        d="M301 23C301 22.4477 301.448 22 302 22H303C303.552 22 304 22.4477 304 23V33C304 33.5523 303.552 34 303 34H302C301.448 34 301 33.5523 301 33V23Z"
        fill="black"
      />
      <Path
        d="M291 28.5C291 27.9477 291.448 27.5 292 27.5H293C293.552 27.5 294 27.9477 294 28.5V33C294 33.5523 293.552 34 293 34H292C291.448 34 291 33.5523 291 33V28.5Z"
        fill="black"
      />
      <Path
        d="M286 31C286 30.4477 286.448 30 287 30H288C288.552 30 289 30.4477 289 31V33C289 33.5523 288.552 34 288 34H287C286.448 34 286 33.5523 286 33V31Z"
        fill="black"
      />
    </Svg>
  );
}
