import { Pressable } from "react-native";

import { Theme } from "@/theme";

import Typography from "../Typography";

interface LinkProps {
  children: string;
  linkColor?: keyof Theme["palette"];
  onPress: () => void;
  textSize?: keyof Theme["typography"]["text"]["sizes"];
}

export default function Link({ children, linkColor = "primaryBase-40", onPress, textSize = "footnote" }: LinkProps) {
  return (
    <Pressable onPress={onPress}>
      <Typography.Text weight="medium" size={textSize} color={linkColor}>
        {children}
      </Typography.Text>
    </Pressable>
  );
}
