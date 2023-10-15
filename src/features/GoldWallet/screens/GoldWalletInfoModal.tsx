import Clipboard from "@react-native-clipboard/clipboard";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import { CopyIcon } from "@/assets/icons";
import { Stack, Typography, WithShadow } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { useToasts } from "@/contexts/ToastsContext";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function GoldWalletInfoModal() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const addToast = useToasts();

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
    Clipboard.setString(item.value);
    addToast({
      icon: <CopyIcon color={copyIconColor} />,
      variant: "success",
      message: `${item.label} ${t("GoldWallet.GoldWalletInfoModal.copyToastMessage")}`,
      position: "top",
    });
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

  const subtitleTitle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["20p"],
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

  const copyIconColor = useThemeStyles(theme => theme.palette["complimentBase-10"]);

  return (
    <Page backgroundColor="neutralBase+30">
      <View style={modalContainerStyle}>
        <NavHeader
          withBackButton={false}
          title={t("GoldWallet.GoldWalletInfoModal.title")}
          end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}
        />
        <ContentContainer>
          <Stack direction="vertical" style={headercontainerStyle}>
            <Typography.Text color="neutralBase+30" size="title1" weight="bold">
              {t("GoldWallet.GoldWalletInfoModal.details")}
            </Typography.Text>
            <Typography.Text color="neutralBase+30" size="title3" weight="bold" style={subtitleTitle}>
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
                    <Stack direction="vertical">
                      <Typography.Text color="neutralBase" size="footnote" weight="regular">
                        {item.label}
                      </Typography.Text>
                      <Typography.Text color="neutralBase+30" size="callout" weight="regular">
                        {item.value}
                      </Typography.Text>
                    </Stack>
                    <Stack direction="vertical" align="center" justify="center">
                      <Pressable onPress={() => handleOnValueCopy(item)}>
                        {/* TODO color will be replaced with another value once UI team change it in design */}
                        <CopyIcon color={copyIconColor} />
                      </Pressable>
                    </Stack>
                  </Stack>
                </Stack>
              );
            })}
          </WithShadow>
        </ContentContainer>
      </View>
    </Page>
  );
}
