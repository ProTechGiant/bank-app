import { Pressable } from "react-native";

import { Theme } from "@/theme";

import Typography from "../Typography";

export interface TextEndButtonProps {
  color?: keyof Theme["palette"];
  onPress: () => void;
  text: string;
}

export default function TextEndButton({ color = "primaryBase-10", onPress, text }: TextEndButtonProps) {
  return (
    <Pressable onPress={onPress}>
      <Typography.Text color={color}>{text}</Typography.Text>
    </Pressable>
  );
}
