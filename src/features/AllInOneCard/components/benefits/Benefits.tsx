import { useTranslation } from "react-i18next";
import { Pressable, TextStyle, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { PartnerList } from "../../types";
import BenefitsItem from "./BenefitsItem";
import Subscriptions from "./Subscriptions";

interface BenefitsProps {
  customerSubscriptions?: PartnerList[];
}

export default function Benefits({ customerSubscriptions }: BenefitsProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleOnPressSeeMore = () => {
    navigation.navigate("AllInOneCard.AllInOneCardStack", { screen: "AllInOneCard.BenefitsScreen" });
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["16p"],
    marginTop: theme.spacing["20p"],
  }));
  const textStyle = useThemeStyles<TextStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  return (
    <Stack style={containerStyle} direction="vertical" align="stretch">
      <Stack direction="horizontal" justify="space-between" align="baseline">
        <Typography.Text size="title3" weight="medium">
          {t("AllInOneCard.Dashboard.benefits")}
        </Typography.Text>
        {customerSubscriptions ? (
          <Typography.Text
            size="footnote"
            weight="regular"
            style={textStyle}
            onPress={handleOnPressSeeMore}
            color="neutralBase">
            {t("AllInOneCard.Dashboard.viewAll")}
          </Typography.Text>
        ) : null}
      </Stack>
      {customerSubscriptions ? (
        <Subscriptions customerSubscriptions={customerSubscriptions} />
      ) : (
        <Pressable
          onPress={() =>
            navigation.navigate("AllInOneCard.AllInOneCardStack", { screen: "AllInOneCard.WelcomeBenefitsScreen" })
          }>
          <BenefitsItem />
        </Pressable>
      )}
    </Stack>
  );
}
