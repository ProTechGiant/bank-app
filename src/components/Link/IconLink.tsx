import { cloneElement } from "react";
import { Pressable, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { Theme, useThemeStyles } from "@/theme";

import Link from "./Link";

interface IconLinkProps {
  children: string;
  icon: React.ReactElement<SvgProps>;
  onPress: () => void;
  iconColor?: keyof Theme["palette"];
  linkColor?: keyof Theme["palette"];
}

export default function IconLink({ children, icon, iconColor = "primaryBase-40", linkColor, onPress }: IconLinkProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing["8p"],
    marginEnd: theme.spacing["8p"],
  }));

  const iconStyleColor = useThemeStyles(theme => theme.palette[iconColor]);

  return (
    <Pressable onPress={onPress} style={containerStyle}>
      {cloneElement(icon, { color: iconStyleColor })}
      <Link onPress={onPress} linkColor={linkColor} textSize="callout">
        {children}
      </Link>
    </Pressable>
  );
}
