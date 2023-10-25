import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { ChevronBottomIcon, ChevronUpIcon } from "@/assets/icons";
import { Stack } from "@/components";
import Button from "@/components/Button";
import Divider from "@/components/Divider";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { AssetsAllocation } from "../types";
import OfferInformationItem from "./OfferInformationItem";
import Tags from "./Tags";

interface MutualFundOffersItemProps {
  id: string;
  name: string;
  YTD: number;
  NAV: number;
  subscriptionFee: number;
  minimumSubscription: number;
  minimumAdditionalSubscription: number;
  dealingDays: string;
  dividend: string;
  frequency: string;
  strategy: string;
  risk: string;
  index: number;
  onToggleExpansion: (value: number) => void;
  isExpanded: boolean;
  onViewDetailsPress: (value: string) => void;
  assetsAllocation: AssetsAllocation;
}

export default function MutualFundOffersItem({
  name,
  YTD,
  NAV,
  subscriptionFee,
  minimumSubscription,
  minimumAdditionalSubscription,
  dealingDays,
  dividend,
  frequency,
  strategy,
  risk,
  index,
  onToggleExpansion,
  isExpanded,
  onViewDetailsPress,
  id,
}: MutualFundOffersItemProps) {
  const { t } = useTranslation();
  const currentHeight = useSharedValue(isExpanded === true ? 550 : 0);

  useEffect(() => {
    currentHeight.value = isExpanded === true ? 550 : 0;
  }, [isExpanded]);

  const handleOnExpandPress = () => {
    onToggleExpansion(index);
  };

  const animatedInformationSectionStyle = useAnimatedStyle(() => ({
    height: withTiming(currentHeight.value, { duration: 500 }),
    overflow: "hidden",
  }));

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-50"],
    borderWidth: 1,
    borderRadius: theme.radii.small,
    borderColor: theme.palette["neutralBase-30"],
    overflow: "hidden",
    marginBottom: theme.spacing["20p"],
  }));

  const stackStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
  }));

  const iconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-20"]);

  const informationContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  return (
    <Pressable onPress={handleOnExpandPress}>
      <View style={containerStyle}>
        <View style={styles.headerPaddingStyle}>
          <Stack direction="horizontal" justify="space-between">
            <Typography.Text color="neutralBase+30" size="body" weight="medium">
              {name}
            </Typography.Text>
            {isExpanded ? <ChevronUpIcon color={iconColor} /> : <ChevronBottomIcon color={iconColor} />}
          </Stack>

          <Tags riskName={risk} />

          <Stack direction="horizontal" justify="space-between">
            <Stack direction="horizontal" style={styles.stackStyle}>
              <Typography.Text color="neutralBase+10" size="footnote" weight="regular">
                {t("MutualFund.DiscoverProductsScreen.NAV")}
              </Typography.Text>
              <Typography.Text color="neutralBase+10" size="footnote" weight="regular">
                {t("MutualFund.DiscoverProductsScreen.twoDot")}
              </Typography.Text>
              <Typography.Text color="neutralBase+10" size="footnote" weight="regular">
                {NAV.toFixed(2)}
              </Typography.Text>
              <Typography.Text color="neutralBase+10" size="footnote" weight="regular">
                {t("MutualFund.DiscoverProductsScreen.currency")}
              </Typography.Text>
            </Stack>

            <Stack direction="horizontal" style={styles.stackStyle}>
              <Typography.Text color="neutralBase+10" size="footnote" weight="regular">
                {t("MutualFund.DiscoverProductsScreen.YTD")}
              </Typography.Text>
              <Typography.Text color="neutralBase+10" size="footnote" weight="regular">
                {t("MutualFund.DiscoverProductsScreen.twoDot")}
              </Typography.Text>
              <Typography.Text color="secondary_mintBase" size="footnote" weight="regular">
                {YTD.toFixed(2)}%
              </Typography.Text>
            </Stack>
          </Stack>
        </View>
        <Animated.View style={[informationContainerStyle, animatedInformationSectionStyle]}>
          <Divider color="neutralBase-30" />
          <View style={styles.informationPaddingStyle}>
            <OfferInformationItem
              label={t("MutualFund.DiscoverProductsScreen.offerInformation.subscriptionFee")}
              value={`${subscriptionFee.toFixed(3)}%`}
            />
            <OfferInformationItem
              label={t("MutualFund.DiscoverProductsScreen.offerInformation.minimumSubscription")}
              value={`${minimumSubscription} ${t("MutualFund.DiscoverProductsScreen.currency")}`}
            />
            <OfferInformationItem
              label={t("MutualFund.DiscoverProductsScreen.offerInformation.minimumAdditionalSubscription")}
              value={`${minimumAdditionalSubscription} ${t("MutualFund.DiscoverProductsScreen.currency")}`}
            />
            <OfferInformationItem
              label={t("MutualFund.DiscoverProductsScreen.offerInformation.valuationDate")}
              value={dealingDays}
            />
            <OfferInformationItem
              label={t("MutualFund.DiscoverProductsScreen.offerInformation.dividend")}
              value={dividend}
            />
            <OfferInformationItem
              label={t("MutualFund.DiscoverProductsScreen.offerInformation.frequency")}
              value={frequency}
            />
            <OfferInformationItem
              label={t("MutualFund.DiscoverProductsScreen.offerInformation.strategy")}
              value={strategy}
              hasDivider={false}
            />
            <Stack direction="horizontal" align="center" justify="center" style={stackStyle}>
              <View style={styles.buttonContainerStyle}>
                <Button onPress={() => onViewDetailsPress(id)} variant="secondary" size="regular">
                  {t("MutualFund.DiscoverProductsScreen.buttonViewDetails")}
                </Button>
              </View>
            </Stack>
          </View>
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonContainerStyle: {
    width: "45%",
  },
  headerPaddingStyle: {
    paddingHorizontal: 15,
    paddingVertical: 17,
  },
  informationPaddingStyle: {
    paddingHorizontal: 17,
    paddingVertical: 15,
  },
  stackStyle: {
    gap: 2,
  },
});
