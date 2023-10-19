import { StyleSheet, View, ViewStyle } from "react-native";

import { Typography } from "@/components";
import { useThemeStyles } from "@/theme";

interface ChartDataItemProps {
  assetColor?: string;
  assetName: string;
  assetValue: string;
  highlighted?: boolean;
}

export default function ChartDataItem({ assetColor, assetName, assetValue, highlighted = false }: ChartDataItemProps) {
  const colorLineStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: assetColor,
      borderRadius: 13,
      height: 5,
      width: 26,
      marginTop: theme.spacing["4p"],
    }),
    [assetColor]
  );

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["4p"],
    flexDirection: "row",
    alignItems: "center",
  }));

  return (
    <View
      style={[
        {
          backgroundColor: highlighted ? "lightgray" : "transparent",
        },
        containerStyle,
      ]}>
      {assetColor && <View style={[colorLineStyle, { marginRight: 8 }]} />}

      <View
        style={[
          {
            backgroundColor: highlighted ? "lightgray" : "transparent",
          },
          styles.textContainerStyle,
        ]}>
        <Typography.Text color="neutralBase+30" size="footnote" weight="medium">
          {assetName}
        </Typography.Text>

        <Typography.Text color="neutralBase+10" size="footnote" weight="regular">
          {assetValue}
        </Typography.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textContainerStyle: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
});
