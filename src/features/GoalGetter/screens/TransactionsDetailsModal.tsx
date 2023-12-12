import { RouteProp, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function TransactionsDetailsModal() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const {
    params: { transaction },
  } = useRoute<RouteProp<AuthenticatedStackParams, "GoalGetter.TransactionsDetailsModal">>();

  const handleOnDonePress = () => {
    navigation.goBack();
  };

  const modalContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["20p"],
    borderRadius: theme.radii.medium,
    flex: 1,
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  const detailsRowStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    padding: theme.spacing["12p"],
    borderColor: theme.palette["neutralBase-30"],
  }));

  const detailsTableContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    marginTop: theme.spacing["20p"],
    borderRadius: theme.radii.small,
  }));

  const doneButtonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "flex-end",
    width: "100%",
    paddingHorizontal: theme.spacing["20p"],
    marginVertical: theme.spacing["20p"],
  }));

  const detailsData = [
    {
      label: t("GoldWallet.chargedFrom"),
      value: transaction.Transaction_id,
    },
    {
      label: t("GoldWallet.status"),
      value: transaction.Status,
    },
    {
      label: t("GoldWallet.type"),
      value: transaction.Type,
    },
    {
      label: t("GoldWallet.goldSerial"),
      value: transaction.SerialNumber,
    },
    {
      label: t("GoldWallet.goldPrice"),
      value: `${transaction.TotalAmount} ${t("GoldWallet.SARG")}`,
    },
    {
      label: t("GoldWallet.goldWeight"),
      value: `${transaction.Weight} ${t("GoldWallet.gram")}`,
    },
  ];

  return (
    <Page backgroundColor="neutralBase+30">
      <View style={modalContainerStyle}>
        <NavHeader title="" end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />} />
        <ContentContainer>
          <Stack direction="vertical">
            <Typography.Text color="neutralBase+30" size="title1" weight="regular">
              {t("GoldWallet.transactions")}
            </Typography.Text>
            <Typography.Text color="neutralBase+10" size="callout" weight="regular">
              {/* TODO will replace actuall data once integrate with api */}8 March 2023, 15:45
              {/* {format(new Date(transaction?.Date), "dd MMM yyyy")} */}
            </Typography.Text>
          </Stack>
          <Stack direction="vertical" style={detailsTableContainerStyle}>
            {detailsData.map((item, index) => {
              if (index === 0) {
                return (
                  <Stack direction="vertical" key={index} style={[detailsRowStyle, { borderBottomWidth: 1 }]}>
                    <Typography.Text color="neutralBase" size="footnote" weight="regular">
                      {item?.label}
                    </Typography.Text>
                    <Typography.Text color="neutralBase+30" size="callout" weight="regular">
                      {item?.value}
                    </Typography.Text>
                  </Stack>
                );
              } else {
                return (
                  <Stack
                    direction="horizontal"
                    align="center"
                    justify="space-between"
                    key={index}
                    style={[detailsRowStyle, { borderBottomWidth: index < detailsData.length - 1 ? 1 : 0 }]}>
                    <Typography.Text color="neutralBase" size="footnote" weight="regular">
                      {item.label}
                    </Typography.Text>
                    <Typography.Text color="neutralBase+30" size="callout" weight="regular">
                      {item.value}
                    </Typography.Text>
                  </Stack>
                );
              }
            })}
          </Stack>
        </ContentContainer>
        <View style={doneButtonContainerStyle}>
          <Button onPress={handleOnDonePress}>{t("GoldWallet.done")}</Button>
        </View>
      </View>
    </Page>
  );
}
