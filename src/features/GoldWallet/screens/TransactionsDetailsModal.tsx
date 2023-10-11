import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function TransactionsDetailsModal() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleOnDonePress = () => {
    //TODO
  };

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
  }));

  const detailsData = [
    {
      label: t("GoldWallet.chargedFrom"),
      value: "1122-001-0011223344555",
    },
    {
      label: t("GoldWallet.status"),
      value: "Complete",
    },
    {
      label: t("GoldWallet.type"),
      value: "Sell",
    },
    {
      label: t("GoldWallet.goldSerial"),
      value: "654387654",
    },
    {
      label: t("GoldWallet.goldPrice"),
      value: "220.36 SAR/g",
    },
    {
      label: t("GoldWallet.goldWeight"),
      value: "8 g",
    },
  ];

  return (
    <Page insets={["bottom", "left", "right"]} backgroundColor="neutralBase-60">
      <NavHeader title="" end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />} />
      <ContentContainer>
        <Stack direction="vertical">
          <Typography.Text color="neutralBase+30" size="title1" weight="regular">
            {t("GoldWallet.transactions")}
          </Typography.Text>
          <Typography.Text color="neutralBase+10" size="callout" weight="regular">
            8 March 2023, 15:45
          </Typography.Text>
        </Stack>
        <Stack direction="vertical" style={detailsTableContainerStyle}>
          {detailsData.map((item, index) => {
            if (index === 0) {
              return (
                <Stack direction="vertical" style={[detailsRowStyle, { borderBottomWidth: 1 }]}>
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
    </Page>
  );
}
