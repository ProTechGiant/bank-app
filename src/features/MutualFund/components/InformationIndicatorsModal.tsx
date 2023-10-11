import { ScrollView, StyleSheet, ViewStyle } from "react-native";

import { CloseIcon } from "@/assets/icons";
import { Modal, Stack, Typography } from "@/components";
import Divider from "@/components/Divider";
import NavHeader from "@/components/NavHeader";
import { useThemeStyles } from "@/theme";

import { INFO_INDICATORS_MODAL_DATA } from "../mocks/informationIndicatorsModalData";

interface InformationIndicatorsModalProps {
  isVisible: boolean;
  onPressInfoIcon: () => void;
}

export default function InformationIndicatorsModal({ isVisible, onPressInfoIcon }: InformationIndicatorsModalProps) {
  const InformationIndicatorsModalDividerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["20p"],
  }));

  return (
    <Modal visible={isVisible} style={styles.InformationIndicatorsModalStyle}>
      <NavHeader
        end={<NavHeader.IconEndButton icon={<CloseIcon />} onPress={onPressInfoIcon} />}
        withBackButton={false}
      />
      <Stack direction="vertical" gap="20p">
        <Typography.Text size="title2" weight="medium">
          {INFO_INDICATORS_MODAL_DATA.headerText}
        </Typography.Text>
      </Stack>
      <Divider color="neutralBase-40" style={InformationIndicatorsModalDividerStyle} />
      <ScrollView style={styles.InformationIndicatorsModalScrollViewStyle} showsVerticalScrollIndicator={false}>
        <Stack direction="vertical" gap="32p">
          {INFO_INDICATORS_MODAL_DATA.InformationList.map(Information => {
            return (
              <Stack direction="vertical" gap="16p">
                <Typography.Text size="title3" weight="medium">
                  {Information.title}
                </Typography.Text>
                <Typography.Text size="callout" weight="medium" color="neutralBase">
                  {Information.description}
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
