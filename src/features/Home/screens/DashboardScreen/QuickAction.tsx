import { cloneElement } from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface QuickActionProps {
  icon: React.ReactElement<SvgProps | IconProps>;
  title: string;
}

export default function QuickAction({ icon: Icon, title }: QuickActionProps) {
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["neutralBase-50"],
      flex: 1,
      height: 95,
      justifyContent: "center",
      margin: theme.spacing.small,
      padding: theme.spacing.medium,
    }),
    []
  );
  const iconStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginBottom: theme.spacing.small,
    }),
    []
  );
  const iconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.accordian, []);
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={container}>
        {cloneElement(Icon, { height: iconDimensions, width: iconDimensions, style: iconStyle })}
        <Typography.Text color="primaryBase" weight="semiBold" size="callout">
          {title}
        </Typography.Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexBasis: "33%",
    flexDirection: "row",
  },
});
