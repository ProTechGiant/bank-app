import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import SvgIcon from "@/components/SvgIcon/SvgIcon";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import {
  ACTIVE_BENEFITS,
  MONTHLY_SUBSCRIPTION,
  STATUS_ACTIVE,
  STATUS_PENDING_ACTIVATION,
  STATUS_PENDING_Termination,
} from "../../constants";
import { PartnerList } from "../../types";

interface SubscriptionsProps {
  customerSubscriptions: PartnerList[];
}

export default function Subscriptions({ customerSubscriptions }: SubscriptionsProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const isPending = (item: PartnerList) =>
    item.CustomerSubscription.Status === STATUS_PENDING_ACTIVATION ||
    item.CustomerSubscription.Status === STATUS_PENDING_Termination;
  const first2Items = customerSubscriptions
    ?.filter(item => isPending(item) || item.CustomerSubscription.Status === STATUS_ACTIVE)
    .slice(0, 2);

  const handleOnPressSubscription = (status: string) => {
    if (status === STATUS_ACTIVE) {
      navigation.navigate("AllInOneCard.AllInOneCardStack", {
        screen: "AllInOneCard.BenefitsScreen",
        params: { activePill: ACTIVE_BENEFITS },
      });
    } else {
      navigation.navigate("AllInOneCard.AllInOneCardStack", { screen: "AllInOneCard.BenefitsScreen" });
    }
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["16p"],
  }));
  const boxContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["12p"],
    borderWidth: 1,
    borderRadius: theme.radii.medium,
    borderColor: theme.palette["neutralBase-30"],
    flex: 1,
    maxWidth: "50%",
  }));
  const activeContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["4p"],
    paddingHorizontal: theme.spacing["8p"],
    backgroundColor: theme.palette["successBase-20"],
    borderRadius: theme.radii.extraSmall,
    alignItems: "center",
  }));
  const pendingBackgroundStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["secondary_yellowBase-30"],
  }));

  return (
    <Stack direction="horizontal" style={containerStyle} justify="space-between" gap="16p">
      {first2Items.map(item => (
        <Pressable
          key={item.PartnerItem.PartnerCode}
          style={boxContainerStyle}
          onPress={handleOnPressSubscription.bind(null, item.CustomerSubscription.Status)}>
          <Stack direction="vertical" gap="12p">
            <Stack direction="horizontal" justify="space-between" style={styles.fullWidth}>
              <SvgIcon uri={item.PartnerItem.PartnerLogo} width={24} height={24} />
              <View style={[activeContainerStyle, isPending(item) ? pendingBackgroundStyle : {}]}>
                <Typography.Text weight="bold" size="caption1">
                  {isPending(item) ? t("AllInOneCard.BenefitsScreen.pending") : t("AllInOneCard.BenefitsScreen.active")}
                </Typography.Text>
              </View>
            </Stack>
            <Stack direction="vertical">
              <Typography.Text weight="medium" size="callout">
                {item.PartnerItem.PartnerName}
              </Typography.Text>
              <Typography.Text color="neutralBase+10" size="footnote">
                {item.PaymentPlan === MONTHLY_SUBSCRIPTION
                  ? t("AllInOneCard.BenefitsScreen.monthlySubscription")
                  : t("AllInOneCard.BenefitsScreen.yearlySubscription")}
              </Typography.Text>
            </Stack>
          </Stack>
        </Pressable>
      ))}
    </Stack>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    width: "100%",
  },
});
