import { Text as RNText, TextProps as RNTextProps, TextStyle } from "react-native";

import { Theme, useThemeStyles } from "@/theme";

interface TextProps extends RNTextProps {
  align?: "left" | "right" | "center";
  color?: keyof Theme["palette"];
  size?: keyof Theme["typography"]["text"]["sizes"];
  weight?: keyof Theme["typography"]["text"]["weights"];
}

function Text({
  align = "left",
  color = "neutralBase+30",
  size = "body",
  weight = "regular",
  style,
  ...restProps
}: TextProps) {
  const styles = useThemeStyles<TextStyle>(
    theme => ({
      color: theme.palette[color],
      fontSize: theme.typography.text.sizes[size],
      fontWeight: theme.typography.text.weights[weight],
      lineHeight: theme.typography.text._lineHeights[size],
      textAlign: align,
    }),
    [align, color, size, weight]
  );

  return <RNText {...restProps} style={[style, styles]} />;
}

interface HeaderProps extends RNTextProps {
  align?: "left" | "right" | "center";
  color?: keyof Theme["palette"];
  size?: keyof Theme["typography"]["header"]["sizes"];
  weight?: keyof Theme["typography"]["header"]["weights"];
}

function Header({
  align = "left",
  color = "neutralBase+30",
  size = "medium",
  weight = "regular",
  style,
  ...restProps
}: HeaderProps) {
  const styles = useThemeStyles<TextStyle>(
    theme => ({
      color: theme.palette[color],
      fontSize: theme.typography.header.sizes[size],
      // @ts-expect-error indexing is correct
      fontWeight: theme.typography.header.weights[weight],
      lineHeight: theme.typography.header._lineHeights[size],
      textAlign: align,
    }),
    [color, size, weight]
  );

  return <RNText {...restProps} style={[style, styles]} />;
}

export default { Header, Text };
