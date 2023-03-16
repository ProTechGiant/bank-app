import { useTranslation } from "react-i18next";
import { ScrollView, View, ViewStyle } from "react-native";

import Divider from "@/components/Divider";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import Content from "./Content";
import { AccessTimeIcon } from "./SingleUseCardAboutIcons/access-time";
import { AccountBalanceIcon } from "./SingleUseCardAboutIcons/account-balance";
import { DevicesIcon } from "./SingleUseCardAboutIcons/devices";
import { PaymentIcon } from "./SingleUseCardAboutIcons/payment";
import { RefundPaymentsIcon } from "./SingleUseCardAboutIcons/refund-payments";
import { SecurityIcon } from "./SingleUseCardAboutIcons/security";
import { StarIcon } from "./SingleUseCardAboutIcons/star";

export default function SingleUseCardAbout() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    paddingLeft: theme.spacing["20p"],
    gap: theme.spacing["20p"],
  }));

  const bottomContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["32p"],
  }));

  const iconColor = useThemeStyles<string>(theme => theme.palette["primaryBase-40"]);

  return (
    <Page backgroundColor="neutralBase-60" insets={["bottom"]}>
      <ScrollView>
        <NavHeader withBackButton={false} end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />} />
        <View style={containerStyle}>
          <Typography.Text color="neutralBase+30" weight="semiBold" size="title1">
            {t("CardActions.SingleUseCard.CardAbout.title")}
          </Typography.Text>
          <Typography.Text color="neutralBase+30" weight="semiBold" size="title3">
            {t("CardActions.SingleUseCard.CardAbout.SectionOne.title")}
          </Typography.Text>
          <View>
            <Content
              icon={<PaymentIcon color={iconColor} />}
              label={t("CardActions.SingleUseCard.CardAbout.SectionOne.SectionOneInfo.label")}
              helperText={t("CardActions.SingleUseCard.CardAbout.SectionOne.SectionOneInfo.helperText")}
            />
            <Divider color="neutralBase-30" />
            <Content
              icon={<SecurityIcon color={iconColor} />}
              label={t("CardActions.SingleUseCard.CardAbout.SectionOne.SectionTwoInfo.label")}
              helperText={t("CardActions.SingleUseCard.CardAbout.SectionOne.SectionTwoInfo.helperText")}
            />
          </View>
          <Typography.Text color="neutralBase+30" weight="semiBold" size="title3">
            {t("CardActions.SingleUseCard.CardAbout.SectionTwo.title")}
          </Typography.Text>
          <View style={bottomContainerStyle}>
            <Content
              icon={<DevicesIcon color={iconColor} />}
              label={t("CardActions.SingleUseCard.CardAbout.SectionTwo.SectionOneInfo.label")}
              helperText={t("CardActions.SingleUseCard.CardAbout.SectionTwo.SectionOneInfo.helperText")}
            />
            <Divider color="neutralBase-30" />
            <Content
              icon={<AccessTimeIcon color={iconColor} />}
              label={t("CardActions.SingleUseCard.CardAbout.SectionTwo.SectionTwoInfo.label")}
              helperText={t("CardActions.SingleUseCard.CardAbout.SectionTwo.SectionTwoInfo.helperText")}
            />
            <Divider color="neutralBase-30" />
            <Content
              icon={<AccountBalanceIcon color={iconColor} />}
              label={t("CardActions.SingleUseCard.CardAbout.SectionTwo.SectionThreeInfo.label")}
              helperText={t("CardActions.SingleUseCard.CardAbout.SectionTwo.SectionThreeInfo.helperText")}
            />
            <Divider color="neutralBase-30" />
            <Content
              icon={<RefundPaymentsIcon color={iconColor} />}
              label={t("CardActions.SingleUseCard.CardAbout.SectionTwo.SectionFourInfo.label")}
              helperText={t("CardActions.SingleUseCard.CardAbout.SectionTwo.SectionFourInfo.helperText")}
            />
            <Divider color="neutralBase-30" />
            <Content
              icon={<StarIcon color={iconColor} />}
              label={t("CardActions.SingleUseCard.CardAbout.SectionTwo.SectionFiveInfo.label")}
              helperText={t("CardActions.SingleUseCard.CardAbout.SectionTwo.SectionFiveInfo.helperText")}
            />
          </View>
        </View>
      </ScrollView>
    </Page>
  );
}
