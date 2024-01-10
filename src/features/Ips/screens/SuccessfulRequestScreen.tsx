import { RouteProp, useRoute } from "@react-navigation/native";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { StatusBar, StyleSheet, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import { SuccessfulIcon } from "../assets/icons";
import { IpsStackParams } from "../IpsStack";
import { RequestDetailsScreenTypeEnum, RequestStatusEnum } from "../type";

export default function SuccessfulRequestScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const {
    params: { amount, referenceNumber, name },
  } = useRoute<RouteProp<IpsStackParams, "IpsStack.SuccessfulRequest">>();

  const INFO_FIELDS: { title: string; value: string }[] = [
    { title: t("Ips.successfulScreen.from"), value: name },
    { title: t("Ips.successfulScreen.amount"), value: formatCurrency(amount, "SAR") },
    { title: t("Ips.successfulScreen.date"), value: format(new Date(), "iii d MMMM") },
    { title: t("Ips.successfulScreen.referenceNumber"), value: referenceNumber },
  ];

  const handleOnSharePress = () => {
    //TODO
  };

  const handleOnDonePress = () => {
    navigation.navigate("Ips.IpsStack", { screen: "IpsStack.HubScreen" });
  };

  const handleOnDetailsPress = () => {
    //TODO change these
    navigation.navigate("Ips.IpsStack", {
      screen: "IpsStack.RequestDetails",
      params: {
        name: "string",
        amount: 300,
        IBAN: "string",
        bank: "string",
        type: RequestDetailsScreenTypeEnum.PENDING,
        referenceNumber: "string",
        status: RequestStatusEnum.PENDING,
        expireAfter: "string",
      },
    });
  };

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
  }));

  const iconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["64p"],
  }));

  const requestInfoBoxStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 1,
    marginBottom: "auto",
    borderRadius: theme.radii.small,
    padding: theme.spacing["16p"],
    borderColor: theme.palette["neutralBase-60"],
    width: "100%",
  }));

  const statusBarColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);

  return (
    <Page backgroundColor="neutralBase+30">
      <StatusBar backgroundColor={statusBarColor} />
      <NavHeader end={<NavHeader.ShareButton onPress={handleOnSharePress} color="neutralBase-60" />} />
      <Stack direction="vertical" align="center" flex={1} style={contentContainerStyle} gap="16p">
        <View style={iconContainerStyle}>
          <SuccessfulIcon />
        </View>

        <Typography.Header size="brand" color="neutralBase-60" weight="bold">
          {t("Ips.successfulScreen.title")}
        </Typography.Header>
        <Typography.Text color="neutralBase-60" size="callout">
          {t("Ips.successfulScreen.subtitle")}
        </Typography.Text>

        <Stack direction="vertical" style={requestInfoBoxStyle} gap="16p">
          {INFO_FIELDS.map(field => (
            <Stack direction="horizontal" justify="space-between" align="center" style={styles.fullWidth}>
              <Typography.Text color="neutralBase-20" size="footnote">
                {field.title}
              </Typography.Text>
              <Typography.Text color="neutralBase-60" size="footnote">
                {field.value}
              </Typography.Text>
            </Stack>
          ))}
        </Stack>

        <Button color="dark" block onPress={handleOnDonePress}>
          <Typography.Text>{t("Ips.successfulScreen.done")}</Typography.Text>
        </Button>
        <Button block variant="tertiary" onPress={handleOnDetailsPress}>
          <Typography.Text color="neutralBase-60">{t("Ips.successfulScreen.details")}</Typography.Text>
        </Button>
      </Stack>
    </Page>
  );
}
const styles = StyleSheet.create({
  fullWidth: {
    width: "100%",
  },
});
