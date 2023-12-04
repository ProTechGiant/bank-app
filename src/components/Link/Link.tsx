import { Pressable } from "react-native";

import { Theme } from "@/theme";

import Typography from "../Typography";

interface LinkProps {
  children: string;
  linkColor?: keyof Theme["palette"];
  onPress: () => void;
  textSize?: keyof Theme["typography"]["text"]["sizes"];
  underline?: boolean;
}

export default function Link({
  children,
  linkColor = "complimentBase",
  onPress,
  textSize = "footnote",
  underline = true,
}: LinkProps) {
  return (
    <Pressable onPress={onPress}>
      <Typography.Text
        weight="medium"
        size={textSize}
        color={linkColor}
        style={underline ? { textDecorationLine: "underline" } : {}}>
        {children}
      </Typography.Text>
    </Pressable>
  );
}
