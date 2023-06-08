import { cloneElement } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg/lib/typescript/ReactNativeSVG";

import { CloseIcon, IconProps } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface ChipProps {
  title: string;
  isRemovable: boolean;
  isSelected: boolean;
  onPress: () => void;
  leftIcon?: React.ReactElement<SvgProps | IconProps>;
  testID?: string;
}

export default function Chip({ title, isRemovable, isSelected, onPress, leftIcon, testID }: ChipProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: isSelected ? theme.palette["neutralBase-40"] : undefined,
      borderRadius: theme.radii.xlarge,
      paddingHorizontal: theme.spacing["16p"],
      paddingVertical: theme.spacing["8p"],
      borderColor: isSelected ? theme.palette.primaryBase : theme.palette["neutralBase-30"],
      borderWidth: 2,
      flexDirection: "row",
      gap: theme.spacing["8p"],
    }),
    [isSelected]
  );

  const iconColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${isRemovable ? t("AccessibilityHelpers.remove") : ""} ${title}`}
      style={containerStyle}
      onPress={onPress}
      testID={testID}>
      {leftIcon ? (
        <View accessible={false}>
          {cloneElement(leftIcon, {
            height: 18,
            width: 18,
            color: iconColor,
          })}
        </View>
      ) : null}
      <Typography.Text size="footnote">{title}</Typography.Text>
      {isRemovable ? <CloseIcon width={18} height={18} /> : null}
    </Pressable>
  );
}
