import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { CloseIcon } from "@/assets/icons";
import { Modal, Stack, Typography } from "@/components";
import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { useThemeStyles } from "@/theme";

import { MutualFundOrderDetailsTable } from "../components";
import { riskConsentText } from "../mocks/riskConsentText";

export default function MutualFundOrderSummaryScreen() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleOnPressCloseIcon = () => {
    //TODO: Navigate to specific screen
  };

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({ padding: theme.spacing["20p"] }));

  const orderSummaryButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <NavHeader end={<NavHeader.IconEndButton icon={<CloseIcon />} onPress={handleOnPressCloseIcon} />} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Stack direction="vertical" gap="24p" style={contentStyle} align="stretch">
          <Stack direction="vertical" gap="4p">
            <Typography.Text size="large" weight="medium">
              {t("MutualFund.MutualFundOrderSummaryScreen.headerTitle")}
            </Typography.Text>
            <Typography.Text color="neutralBase+10">
              {t("MutualFund.MutualFundOrderSummaryScreen.headerDescription")}
            </Typography.Text>
          </Stack>
          <MutualFundOrderDetailsTable />
        </Stack>
      </ScrollView>
      <View style={orderSummaryButtonStyle}>
        <Button
          onPress={() => {
            //TODO: when the api is ready will check if there is a risk we'll show the modal, if there is resk go directly to OTP
            setIsVisible(true);
          }}>
          {t("MutualFund.MutualFundOrderSummaryScreen.button")}
        </Button>
      </View>
      <Modal visible={isVisible}>
        <NavHeader
          title="Risk Consent"
          end={
            <NavHeader.IconEndButton
              icon={<CloseIcon />}
              onPress={() => {
                setIsVisible(false);
              }}
            />
          }
          withBackButton={false}
        />
        <Stack direction="vertical" align="stretch" gap="64p">
          <Typography.Text color="neutralBase+10">{riskConsentText}</Typography.Text>
          <Stack direction="vertical" align="stretch">
            <Button
              onPress={() => {
                //TODO: Navigate to OTP Subscription flow
              }}>
              {t("MutualFund.MutualFundOrderSummaryScreen.RiskConsentModal.AgreeButton")}
            </Button>
            <Button
              onPress={() => {
                setIsVisible(false);
              }}
              variant="tertiary">
              {t("MutualFund.MutualFundOrderSummaryScreen.RiskConsentModal.CancelButton")}
            </Button>
          </Stack>
        </Stack>
      </Modal>
    </Page>
  );
}
