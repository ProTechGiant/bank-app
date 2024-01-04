import { I18nManager, Pressable, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";

import { ChevronRightIcon, InfoCircleIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface DetailedRowProps {
  name: string;
  value?: string;
  roundup?: boolean;
  openModel?: (arg: boolean) => void;
  showIcon?: boolean;
  testID?: string;
  onPress?: () => void;
}

export default function DetailedRow({ name, openModel, value, roundup, showIcon, testID, onPress }: DetailedRowProps) {
  const row = useThemeStyles<ViewStyle>(theme => ({
    justifyContent: "space-between",
    flexDirection: "row",
    paddingVertical: theme.spacing["12p"],
  }));

  const rowTitle = useThemeStyles<TextStyle>(theme => ({
    lineHeight: theme.typography.text._lineHeights.callout,
  }));

  const rowValue = useThemeStyles<TextStyle>(theme => ({
    lineHeight: theme.typography.text._lineHeights.callout,
  }));

  const chevColor = useThemeStyles<string>(theme => theme.palette["neutralBase-20"]);

  const infoColor = useThemeStyles(theme => theme.palette["neutralBase-10"]);

  return (
    <Pressable onPress={onPress}>
      <View style={row} testID={testID}>
        <Typography.Text style={rowTitle} size="callout" weight="medium" color="neutralBase+30">
          {name}
        </Typography.Text>

        <View style={styles.rowIcon}>
          <Typography.Text style={rowValue} size="callout" weight="medium" color="neutralBase-10">
            {value}
          </Typography.Text>
          {showIcon ? (
            <View style={styles.iconStyle}>
              <ChevronRightIcon color={chevColor} />
            </View>
          ) : null}
          {roundup ? (
            <TouchableOpacity style={styles.infoStyle} onPress={() => (openModel ? openModel(true) : null)}>
              <InfoCircleIcon color={infoColor} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconStyle: {
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
  infoStyle: {
    marginStart: 6,
  },
  rowIcon: {
    alignItems: "center",
    flexDirection: "row",
    maxWidth: "60%",
  },
});
