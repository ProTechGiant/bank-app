import Clipboard from "@react-native-clipboard/clipboard";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { CloseIcon } from "@/assets/icons";
import { Stack, Typography, WithShadow } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import List from "@/components/List";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { LocalShippingIcon } from "../assets/LocalShippingIcon";
import { NewCopyIcon } from "../assets/NewCopyIcon";

export default function GoldWalletInfoModal() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [copyPressed, setCopyPressed] = useState<boolean>(false);
  const [copyValuePressed, setCopyValuePressed] = useState<string>("");

  const {
    params: { accountNumber, walletNumber },
  } = useRoute<RouteProp<AuthenticatedStackParams, "GoldWallet.GoldWalletInfoModal">>();

  const infoList = [
    {
      label: t("GoldWallet.GoldWalletInfoModal.walletNumber"),
      value: walletNumber,
    },
    {
      label: t("GoldWallet.GoldWalletInfoModal.linkedAccount"),
      value: accountNumber,
    },
  ];

  const handleOnValueCopy = (item: { label: string; value: string }) => {
    setCopyPressed(true);
    setCopyValuePressed(item.label);

    Clipboard.setString(item.value);
  };

  const modalContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["20p"],
    borderRadius: theme.radii.medium,
    flex: 1,
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  const headercontainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["20p"],
  }));
  const copyContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["successBase-30"],
    borderRadius: theme.radii.regular,
  }));
  const subtitleTitle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["16p"],
  }));

  const infoCardStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    borderBottomColor: theme.palette["neutralBase-40"],
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  const infoCardRowStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    padding: theme.spacing["16p"],
  }));
  const seperatorStyle = useThemeStyles<ViewStyle>(theme => ({
    borderBottomColor: theme.palette["neutralBase-40"],
    borderBottomWidth: 1,
    width: "110%",
    marginTop: theme.spacing["20p"],
    marginHorizontal: -theme.spacing["20p"],
  }));
  const deliveryStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["20p"],
    width: "90%",
  }));
  const copyStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["16p"],
  }));
  const copyIconColor = useThemeStyles(theme => theme.palette.neutralBase);
  const copyIconSecondaryColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);

  return (
    <Page backgroundColor="neutralBase+30">
      <View style={modalContainerStyle}>
        <NavHeader
          withBackButton={false}
          title={t("GoldWallet.GoldWalletInfoModal.title")}
          end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}
        />

        <ContentContainer>
          {copyPressed ? (
            <View style={copyContainerStyle}>
              <List style={copyStyle}>
                <List.Item.Primary
                  end={
                    <Pressable
                      onPress={() => {
                        setCopyPressed(false);
                      }}>
                      <CloseIcon />
                    </Pressable>
                  }
                  icon={<NewCopyIcon color={copyIconSecondaryColor} />}
                  onPress={() => {
                    //TODO
                  }}
                  label={copyValuePressed + " " + t("GoldWallet.GoldWalletInfoModal.copyToastMessage")}
                  testID="SavingsGoals.FundGoalModal:SelectRecommendedAmountButton"
                />
              </List>
            </View>
          ) : null}
          <Stack direction="vertical" style={headercontainerStyle}>
            <Typography.Text color="neutralBase+30" size="title3" weight="medium" style={subtitleTitle}>
              {t("GoldWallet.GoldWalletInfoModal.subtitle")}
            </Typography.Text>
          </Stack>
          <WithShadow backgroundColor="neutralBase-50" borderRadius="small">
            {infoList.map((item, index) => {
              return (
                <Stack
                  direction="vertical"
                  justify="flex-start"
                  key={index}
                  style={[infoCardStyle, { borderBottomWidth: index === 0 ? 1 : 0 }]}>
                  <Stack direction="horizontal" align="stretch" justify="space-between" style={infoCardRowStyle}>
                    <Stack direction="vertical" gap="4p">
                      <Typography.Text color="neutralBase" size="caption1" weight="regular">
                        {item.label}
                      </Typography.Text>
                      <Typography.Text color="neutralBase+30" size="callout" weight="regular">
                        {item.value}
                      </Typography.Text>
                    </Stack>
                    <Stack direction="vertical" align="center" justify="center">
                      <Pressable onPress={() => handleOnValueCopy(item)}>
                        {/* TODO color will be replaced with another value once UI team change it in design */}
                        <NewCopyIcon color={copyIconColor} />
                      </Pressable>
                    </Stack>
                  </Stack>
                </Stack>
              );
            })}
          </WithShadow>
          <View style={seperatorStyle} />
          <Stack direction="horizontal" gap="12p" style={deliveryStyle}>
            <LocalShippingIcon />
            <Stack direction="vertical" gap="4p">
              <Typography.Text color="neutralBase+30" size="body" weight="medium">
                {t("GoldWallet.GoldWalletInfoModal.delivery")}
              </Typography.Text>
              <Typography.Text color="neutralBase" size="footnote" weight="regular">
                {t("GoldWallet.GoldWalletInfoModal.deliveryDescription")}
                <Typography.Text
                  color="complimentBase"
                  size="footnote"
                  weight="medium"
                  style={styles.deliveryContactStyle}>
                  {t("GoldWallet.GoldWalletInfoModal.contact")}
                </Typography.Text>
              </Typography.Text>
            </Stack>
          </Stack>
        </ContentContainer>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  deliveryContactStyle: {
    textDecorationLine: "underline",
  },
});
