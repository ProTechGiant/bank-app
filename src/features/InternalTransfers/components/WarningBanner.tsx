import { cloneElement } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface WarningBannerProps {
  icon?: React.ReactElement<SvgProps>;
  text: string;
  testID?: string;
}

export default function WarningBanner({ icon, text, testID }: WarningBannerProps) {
  const containerStyles = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "flex-start",
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.radii.small,
    columnGap: theme.spacing["12p"],
    justifyContent: "center",
    flexDirection: "row",
    padding: theme.spacing["20p"],
    marginTop: theme.spacing["16p"],
    width: "100%",
  }));
  const iconColor = useThemeStyles<string>(theme => theme.palette["neutralBase+10"]);

  return (
    <View style={containerStyles} testID={testID}>
      {icon !== undefined ? <View>{cloneElement(icon, { color: iconColor })}</View> : null}
      <Typography.Text color="neutralBase+10" size="footnote" weight="regular" style={styles.text}>
        {text}
      </Typography.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    flexShrink: 1,
    flexWrap: "wrap",
    marginRight: 3,
  },
});
