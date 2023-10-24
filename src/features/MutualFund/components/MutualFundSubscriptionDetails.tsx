import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { ChevronBottomIcon, ChevronUpIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

import { SubscriptionDetailsIcon } from "../assets/icons";
import MutualFundOrderDetailsTable from "./MutualFundOrderDetailsTable";

export default function MutualFundSubscriptionDetails() {
  const { t } = useTranslation();

  const [isExpanded, setIsExpanded] = useState(false);
  const currentHeight = useSharedValue(isExpanded === true ? 450 : 0);

  useEffect(() => {
    currentHeight.value = isExpanded === true ? 450 : 0;
  }, [isExpanded]);

  const animatedSubscriptionDetailsStyle = useAnimatedStyle(() => ({
    height: withTiming(currentHeight.value, { duration: 500 }),
    overflow: "hidden",
  }));

  const stackStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  const iconColor = useThemeStyles<string>(theme => theme.palette["neutralBase+10"]);

  const handleOnExpandPress = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Pressable onPress={handleOnExpandPress}>
      <Stack direction="horizontal" align="center" justify="space-between" style={stackStyle}>
        <Stack direction="horizontal" gap="12p" align="center">
          <SubscriptionDetailsIcon />
          <Typography.Text size="title3" weight="medium">
            {t("MutualFund.MutualFundDetailsScreen.SubscriptionDetailsSubTitle")}
          </Typography.Text>
        </Stack>
        <Stack direction="vertical" align="center" justify="center">
          {isExpanded ? <ChevronUpIcon color={iconColor} /> : <ChevronBottomIcon color={iconColor} />}
        </Stack>
      </Stack>
      <Animated.View style={animatedSubscriptionDetailsStyle}>
        <MutualFundOrderDetailsTable hasHeader={false} />
      </Animated.View>
    </Pressable>
  );
}
