import { StyleSheet, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export interface ContentProps {
  icon: React.ReactElement<SvgProps | IconProps>;
  label: string;
  helperText: string;
}

export default function Content({ icon, helperText, label }: ContentProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignContent: "center",
    flexDirection: "row",
    paddingVertical: theme.spacing["16p"],
    justifyContent: "space-between",
  }));

  const helperTextStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["4p"],
  }));

  return (
    <View style={containerStyle}>
      {icon !== undefined && <View style={styles.icon}>{icon}</View>}
      <View style={styles.container}>
        <View style={styles.label}>
          <Typography.Text size="callout" weight="medium" color="neutralBase+30">
            {label}
          </Typography.Text>
        </View>
        {!!helperText && (
          <View style={helperTextStyle}>
            <Typography.Text color="neutralBase" size="footnote">
              {helperText}
            </Typography.Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.9,
  },
  icon: {
    alignSelf: "flex-start",
  },
  label: {
    flexDirection: "row",
  },
});
