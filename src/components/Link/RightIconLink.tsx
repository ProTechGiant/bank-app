import { cloneElement } from "react";
import { Pressable, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { Theme, useThemeStyles } from "@/theme";

import Link from "./Link";

interface RightIconLinkProps {
  children: string;
  icon: React.ReactElement<SvgProps>;
  onPress: () => void;
  textSize?: keyof Theme["typography"]["text"]["sizes"];
  iconColor?: keyof Theme["palette"];
  linkColor?: keyof Theme["palette"];
}

export default function RightIconLink({
  children,
  icon,
  iconColor = "primaryBase-40",
  textSize = "callout",
  linkColor,
  onPress,
}: RightIconLinkProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing["8p"],
    marginEnd: theme.spacing["8p"],
  }));

  const iconStyleColor = useThemeStyles(theme => theme.palette[iconColor]);

  return (
    <Pressable onPress={onPress} style={containerStyle}>
      <Link onPress={onPress} linkColor={linkColor} textSize={textSize}>
        {children}
      </Link>
      {cloneElement(icon, { color: iconStyleColor, height: 18, width: 18 })}
    </Pressable>
  );
}
