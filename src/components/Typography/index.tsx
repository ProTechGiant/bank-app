import { Text as RNText, TextProps as RNTextProps, TextStyle } from "react-native";

import { Theme, useThemeStyles } from "@/theme";

interface TextProps extends RNTextProps {
  color?: keyof Theme["palette"];
  size?: keyof Theme["typography"]["text"]["sizes"];
  weight?: keyof Theme["typography"]["text"]["weights"];
}

function Text({ color = "neutralBase+30", size = "body", weight = "regular", style, ...restProps }: TextProps) {
  const styles = useThemeStyles<TextStyle>(theme => ({
    color: theme.palette[color],
    fontSize: theme.typography.text.sizes[size],
    // @ts-expect-error indexing is correct
    fontWeight: theme.typography.text.weights[weight],
    lineHeight: theme.typography.text._lineHeights[size],
  }));

  return <RNText {...restProps} style={[style, styles]} />;
}

interface HeaderProps extends RNTextProps {
  color?: keyof Theme["palette"];
  size?: keyof Theme["typography"]["header"]["sizes"];
  weight?: keyof Theme["typography"]["header"]["weights"];
}

function Header({ color = "neutralBase+30", size = "medium", weight = "regular", style, ...restProps }: HeaderProps) {
  const styles = useThemeStyles<TextStyle>(theme => ({
    color: theme.palette[color],
    fontSize: theme.typography.header.sizes[size],
    // @ts-expect-error indexing is correct
    fontWeight: theme.typography.header.weights[weight],
    lineHeight: theme.typography.header._lineHeights[size],
  }));

  return <RNText {...restProps} style={[style, styles]} />;
}

export default { Header, Text };
