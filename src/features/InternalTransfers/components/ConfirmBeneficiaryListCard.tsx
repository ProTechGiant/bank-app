import { cloneElement } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { palette } from "@/theme/values";

interface ConfirmBeneficiaryListCardProps {
  caption: string;
  label: string | undefined;
  icon: React.ReactElement<SvgProps | IconProps>;
  iconBackground?: keyof typeof palette;
  testID?: string;
  isLastItem?: boolean;
  rightIcon?: React.ReactElement<SvgProps | IconProps>;
  onPressRightIcon?: () => void;
}

export default function ConfirmBeneficiaryListCard({
  caption,
  label,
  icon,
  iconBackground,
  testID,
  isLastItem,
  rightIcon,
  onPressRightIcon,
}: ConfirmBeneficiaryListCardProps) {
  const iconBackgroundStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: iconBackground !== undefined ? theme.palette[iconBackground] : undefined,
      width: 44,
      height: 44,
      borderRadius: 44 / 2,
      alignItems: "center",
      justifyContent: "center",
    }),
    [iconBackground]
  );

  const iconColor = useThemeStyles(theme => theme.palette["primaryBase-40"]);

  const listContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "center",
    marginRight: theme.spacing["12p"],
  }));

  return (
    <View style={[styles.containerStyle, isLastItem && styles.isLastItemNoBorder]}>
      <View style={[listContainerStyle, iconBackground !== undefined && iconBackgroundStyle]}>
        {cloneElement(icon, { color: icon.props.color ?? iconColor })}
      </View>
      <View style={styles.container}>
        <View style={styles.label}>
          <View>
            <Typography.Text color="neutralBase" size="footnote">
              {caption}
            </Typography.Text>
            <Typography.Text color="neutralBase+30" size="callout" weight="regular" testID={testID}>
              {label}
            </Typography.Text>
          </View>
        </View>
      </View>
      {rightIcon !== undefined ? (
        <Pressable onPress={()=> onPressRightIcon()}>
          <View>{cloneElement(rightIcon, { color: rightIcon.props.color ?? iconColor })}</View>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerStyle: {
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: palette["neutralBase-30"],
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  isLastItemNoBorder: {
    borderBottomWidth: 0,
  },
  label: {
    alignItems: "center",
    flexDirection: "row",
  },
});
