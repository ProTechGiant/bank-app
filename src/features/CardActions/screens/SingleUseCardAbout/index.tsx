import { useTranslation } from "react-i18next";
import { ScrollView, View, ViewStyle } from "react-native";

import Divider from "@/components/Divider";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import Content from "./Content";
import AccountBalance from "./SingleUseCardAboutIcons/account-balance.svg";
import Payment from "./SingleUseCardAboutIcons/payment.svg";
import RefundPayments from "./SingleUseCardAboutIcons/payments.svg";
import Security from "./SingleUseCardAboutIcons/security.svg";
import ShoppingBag from "./SingleUseCardAboutIcons/shopping-bag.svg";
import StarBorder from "./SingleUseCardAboutIcons/star-border.svg";

export default function SingleUseCardAbout() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const containerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      display: "flex",
      paddingHorizontal: theme.spacing["20p"],
      flex: 1,
      gap: theme.spacing["20p"],
    }),
    []
  );

  return (
    <Page backgroundColor="neutralBase-60" insets={["bottom"]}>
      <ScrollView>
        <NavHeader withBackButton={false} end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />} />
        <View style={containerStyle}>
          <Typography.Text color="neutralBase+30" weight="semiBold" size="title1">
            {t("Cards.SingleUseCard.CardAbout.title")}
          </Typography.Text>
          <Typography.Text color="neutralBase+30" weight="semiBold" size="title3">
            {t("Cards.SingleUseCard.CardAbout.SectionOne.title")}
          </Typography.Text>
          <View>
            <Content
              icon={<ShoppingBag />}
              label={t("Cards.SingleUseCard.CardAbout.SectionOne.SectionOneInfo.label")}
              helperText={t("Cards.SingleUseCard.CardAbout.SectionOne.SectionOneInfo.helperText")}
            />
            <Divider color="neutralBase-30" />
            <Content
              icon={<Security />}
              label={t("Cards.SingleUseCard.CardAbout.SectionOne.SectionTwoInfo.label")}
              helperText={t("Cards.SingleUseCard.CardAbout.SectionOne.SectionTwoInfo.helperText")}
            />
          </View>
          <Typography.Text color="neutralBase+30" weight="semiBold" size="title3">
            {t("Cards.SingleUseCard.CardAbout.SectionTwo.title")}
          </Typography.Text>
          <View>
            <Content
              icon={<Payment />}
              label={t("Cards.SingleUseCard.CardAbout.SectionTwo.SectionOneInfo.label")}
              helperText={t("Cards.SingleUseCard.CardAbout.SectionTwo.SectionOneInfo.helperText")}
            />
            <Divider color="neutralBase-30" />
            <Content
              icon={<AccountBalance />}
              label={t("Cards.SingleUseCard.CardAbout.SectionTwo.SectionTwoInfo.label")}
              helperText={t("Cards.SingleUseCard.CardAbout.SectionTwo.SectionTwoInfo.helperText")}
            />
            <Divider color="neutralBase-30" />
            <Content
              icon={<RefundPayments />}
              label={t("Cards.SingleUseCard.CardAbout.SectionTwo.SectionThreeInfo.label")}
              helperText={t("Cards.SingleUseCard.CardAbout.SectionTwo.SectionThreeInfo.helperText")}
            />
            <Divider color="neutralBase-30" />
            <Content
              icon={<StarBorder />}
              label={t("Cards.SingleUseCard.CardAbout.SectionTwo.SectionFourInfo.label")}
              helperText={t("Cards.SingleUseCard.CardAbout.SectionTwo.SectionFourInfo.helperText")}
            />
          </View>
        </View>
      </ScrollView>
    </Page>
  );
}
