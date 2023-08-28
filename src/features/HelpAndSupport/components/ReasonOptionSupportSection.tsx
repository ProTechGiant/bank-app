import { useEffect, useState } from "react";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { SvgProps } from "react-native-svg";

import { ChevronRightIcon } from "@/assets/icons";
import { IconProps } from "@/assets/icons";
import { RadioButton, RadioButtonGroup } from "@/components/RadioButton";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { SubOption } from "../types";

export interface ReasonOptionSectionProps {
  name: string;
  description: string;
  subOptions: SubOption[];
  icon: React.ReactElement<SvgProps | IconProps>;
  onChange: (value: string) => void;
  enquiryType: string;
  setEnquiryType: (value: string) => void;
  updateExpandedSupportSectionCount: (value: number) => void;
}

export default function ReasonOptionSupportSection({
  name,
  description,
  subOptions,
  icon,
  onChange,
  enquiryType,
  setEnquiryType,
  updateExpandedSupportSectionCount,
}: ReasonOptionSectionProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedIndexReason, setSelectedIndexReason] = useState<number>(subOptions.length);
  const currentHeight = useSharedValue(isExpanded === true ? 200 : 0);

  useEffect(() => {
    currentHeight.value = isExpanded === true ? 200 : 0;
  }, [isExpanded]);

  const handleOnExpandPress = () => {
    setIsExpanded(c => !c);
    if (isExpanded) {
      updateExpandedSupportSectionCount(-1);
    } else {
      updateExpandedSupportSectionCount(1);
    }
  };

  const animatedSectionOptionsStyle = useAnimatedStyle(
    () => ({
      height: withTiming(currentHeight.value, { duration: 500 }),
      overflow: "hidden",
    }),
    [isExpanded]
  );

  const rightIconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-20"]);

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["20p"],
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.small,
    marginVertical: theme.spacing["12p"],
  }));

  const marginStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["12p"],
  }));

  return (
    <Pressable onPress={handleOnExpandPress}>
      <Stack direction="horizontal" gap="16p" style={contentStyle}>
        {icon}
        <Stack direction="vertical" gap="4p" flex={1}>
          <Stack direction="horizontal" gap="16p" style={marginStyle}>
            <Stack direction="vertical" gap="4p" flex={1}>
              <Typography.Text color="neutralBase+30" size="title3" weight="medium">
                {name}
              </Typography.Text>
              <Typography.Text color="neutralBase+10" size="footnote" weight="regular">
                {description}
              </Typography.Text>
            </Stack>
            <View style={[styles.chevronContainer, isExpanded && styles.chevronDown]}>
              <ChevronRightIcon color={rightIconColor} />
            </View>
          </Stack>
          <Animated.View style={[styles.radioGroupContainer, animatedSectionOptionsStyle]}>
            <RadioButtonGroup
              onPress={value => {
                setEnquiryType(name);
                onChange(`${value}`);
                setSelectedIndexReason(value);
              }}
              value={enquiryType === name ? selectedIndexReason : subOptions.length}>
              {subOptions.map(option => {
                return <RadioButton key={`radio-${option.Id}`} label={option.Name} value={option.Id} />;
              })}
            </RadioButtonGroup>
          </Animated.View>
        </Stack>
      </Stack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chevronContainer: {
    alignSelf: "center",
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
  chevronDown: {
    transform: [{ rotate: "90deg" }],
  },
  radioGroupContainer: {
    width: "100%",
  },
});
