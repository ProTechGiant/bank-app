import { StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface DetailedRowProps {
  name: string;
  value?: string;
  roundup?: boolean;
  openModel?: (arg: boolean) => void;
}

export default function DetailedRow({ name, openModel, value, roundup }: DetailedRowProps) {
  const row = useThemeStyles<ViewStyle>(theme => ({
    justifyContent: "space-between",
    flexDirection: "row",
    paddingVertical: theme.spacing["10p"],
  }));

  const rowTitle = useThemeStyles<TextStyle>(theme => ({
    lineHeight: theme.typography.text._lineHeights.callout,
  }));

  const rowValue = useThemeStyles<TextStyle>(theme => ({
    lineHeight: theme.typography.text._lineHeights.callout,
  }));

  const infoColor = useThemeStyles(theme => theme.palette["neutralBase-10"]);

  return (
    <View style={row}>
      <Typography.Text style={rowTitle} size="callout" weight="medium" color="neutralBase+30">
        {name}
      </Typography.Text>

      <View style={styles.rowIcon}>
        <Typography.Text style={rowValue} size="callout" weight="regular" color="neutralBase">
          {value}
        </Typography.Text>
        {roundup ? (
          <TouchableOpacity style={styles.infoStyle} onPress={() => (openModel ? openModel(true) : null)}>
            <InfoCircleIcon color={infoColor} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoStyle: {
    marginStart: 6,
  },
  rowIcon: {
    alignItems: "center",
    flexDirection: "row",
  },
});
