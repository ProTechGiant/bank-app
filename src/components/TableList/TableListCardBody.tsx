import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { useInfoStyles } from "./styling";

interface TableListCardBodyProps {
  isError?: boolean;
  helperText?: string;
  label: string;
  onInfoPress?: () => void;
  isInactive?: boolean;
}

export default function TableListCardBody({
  isError,
  helperText,
  label,
  onInfoPress,
  isInactive,
}: TableListCardBodyProps) {
  const { infoIconStyle, infoColor, infoDimensions } = useInfoStyles();

  const helperTextStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["4p"],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.label}>
        <Typography.Text color={isInactive ? "neutralBase-10" : "neutralBase+30"} size="callout" weight="medium">
          {label}
        </Typography.Text>
        {undefined !== onInfoPress && (
          <Pressable onPress={onInfoPress} style={infoIconStyle}>
            <InfoCircleIcon color={infoColor} width={infoDimensions} height={infoDimensions} />
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
