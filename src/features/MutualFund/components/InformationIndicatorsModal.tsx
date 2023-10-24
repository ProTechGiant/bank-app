import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, ViewStyle } from "react-native";

import { CloseIcon } from "@/assets/icons";
import { Modal, Stack, Typography } from "@/components";
import Divider from "@/components/Divider";
import NavHeader from "@/components/NavHeader";
import { useThemeStyles } from "@/theme";

interface InformationIndicatorsModalProps {
  isVisible: boolean;
  onPressInfoIcon: () => void;
}

export default function InformationIndicatorsModal({ isVisible, onPressInfoIcon }: InformationIndicatorsModalProps) {
  const { t } = useTranslation();

  const InformationIndicatorsModalDividerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["20p"],
  }));

  const INFO_INDICATORS_MODAL_DATA = [
    t("MutualFund.InformationIndicatorsModal.nav"),
    t("MutualFund.InformationIndicatorsModal.ytd"),
    t("MutualFund.InformationIndicatorsModal.currentPrice"),
    t("MutualFund.InformationIndicatorsModal.lastYearPrice"),
  ];

  return (
    <Modal visible={isVisible} style={styles.InformationIndicatorsModalStyle}>
      <NavHeader
        end={<NavHeader.IconEndButton icon={<CloseIcon />} onPress={onPressInfoIcon} />}
        withBackButton={false}
      />
      <Stack direction="vertical" gap="20p">
        <Typography.Text size="title2" weight="medium">
          {t("MutualFund.InformationIndicatorsModal.headerTitle")}
        </Typography.Text>
      </Stack>
      <Divider color="neutralBase-40" style={InformationIndicatorsModalDividerStyle} />
      <ScrollView style={styles.InformationIndicatorsModalScrollViewStyle} showsVerticalScrollIndicator={false}>
        <Stack direction="vertical" gap="32p">
          {INFO_INDICATORS_MODAL_DATA.map(Information => {
            return (
              <Stack direction="vertical" gap="16p">
                <Typography.Text size="title3" weight="medium">
                  {Information}
                </Typography.Text>
                <Typography.Text size="callout" weight="medium" color="neutralBase">
                  {t("MutualFund.InformationIndicatorsModal.description")}
                </Typography.Text>
              </Stack>
            );
          })}
        </Stack>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  InformationIndicatorsModalScrollViewStyle: { height: "80%" },
  InformationIndicatorsModalStyle: { height: "95%" },
});
