import { cloneElement } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import Typography from "@/components/Typography";
import { iconDimensions, palette, spacing } from "@/theme/values";

interface QuickActionProps {
  icon: React.ReactElement<SvgProps | IconProps>;
  title: string;
}

export default function QuickAction({ icon: Icon, title }: QuickActionProps) {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.container}>
        {cloneElement(Icon, { height: iconDimensions.accordian, width: iconDimensions.accordian, style: styles.icon })}
        <Typography.Text color="primaryBase" weight="semiBold" size="callout">
          {title}
        </Typography.Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette["neutralBase-50"],
    flex: 1,
    height: 95,
    justifyContent: "center",
    margin: spacing.small,
    padding: spacing.medium,
  },
  icon: {
    marginBottom: spacing.small,
  },
  wrapper: {
    flexBasis: "33%",
    flexDirection: "row",
  },
});
