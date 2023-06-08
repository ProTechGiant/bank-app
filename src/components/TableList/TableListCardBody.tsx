import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { useInfoStyles } from "./styling";

interface TableListCardBodyProps {
  background?: "dark" | "light";
  isError?: boolean;
  helperText?: string;
  caption?: string;
  label: string;
  onInfoPress?: () => void;
  isInactive?: boolean;
}

export default function TableListCardBody({
  background = "light",
  isError,
  helperText,
  caption,
  label,
  onInfoPress,
  isInactive,
}: TableListCardBodyProps) {
  const { infoIconStyle, infoColor } = useInfoStyles();

  const helperTextStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["4p"],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.label}>
        <View>
          {caption !== undefined ? (
            <Typography.Text color={background === "dark" ? "neutralBase+10" : "neutralBase"} size="footnote">
              {caption}
            </Typography.Text>
          ) : null}
          <Typography.Text
            color={isInactive ? "neutralBase-10" : background === "dark" ? "neutralBase-60" : "neutralBase+30"}
            size="callout"
            weight="medium">
            {label}
          </Typography.Text>
        </View>
        {undefined !== onInfoPress && (
          <Pressable onPress={onInfoPress} style={infoIconStyle}>
            <InfoCircleIcon color={infoColor} width={20} height={20} />
          </Pressable>
        )}
      </View>
      {undefined !== helperText ? (
        <View style={helperTextStyle}>
          <Typography.Text color={isError ? "errorBase" : "neutralBase"} size="footnote">
            {helperText}
          </Typography.Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    alignItems: "center",
    flexDirection: "row",
  },
});
