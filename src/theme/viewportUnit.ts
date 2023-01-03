import { Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export const vw: number = windowWidth / 100;
export const vh: number = windowHeight / 100;
export const vmin: number = Math.min(vw, vh);
export const vmax: number = Math.min(vw, vh);
