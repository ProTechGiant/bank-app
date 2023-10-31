import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Modal, StyleSheet, View, ViewStyle } from "react-native";

import { CloseIcon } from "@/assets/icons";
import { Stack } from "@/components";
import NavHeader from "@/components/NavHeader";
import { useThemeStyles } from "@/theme";

import { CircleCurrencyIcon, FileIcon, WithdrawalIcon } from "../assets/icons";
import Illustrations from "../assets/Illustrations.png";
import SavingPotSection from "./SavingPotSection";

interface GoalSetupIllustrationModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function GoalSetupIllustration({ isVisible, onClose }: GoalSetupIllustrationModalProps) {
  const { t } = useTranslation();
  const iconColor = useThemeStyles(theme => theme.palette["complimentBase-10"]);

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: theme.palette["neutralBase-20-30%"],
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    paddingHorizontal: theme.spacing["12p"],
    borderRadius: theme.radii.medium,
    flex: 1,
  }));

  const imageContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
    overflow: "hidden",
    marginBottom: theme.spacing["32p"],
  }));

  return (
    <Modal transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={containerStyle}>
        <View style={contentStyle}>
          <NavHeader
            title={t("GoalGetter.GoalSetupIllustration.title")}
            end={<NavHeader.IconEndButton icon={<CloseIcon />} onPress={onClose} />}
            withBackButton={false}
          />
          <View style={imageContainerStyle}>
            {/* TODO : this image will remove when the illustration is ready */}
            <Image source={Illustrations} style={styles.IllustrationsStyle} />
          </View>
          <Stack direction="vertical" gap="16p">
            <SavingPotSection
              title={t("GoalGetter.GoalSetupIllustration.descriptionSection.title")}
              description={t("GoalGetter.GoalSetupIllustration.descriptionSection.description")}
              icon={<FileIcon color={iconColor} />}
            />
            <SavingPotSection
              title={t("GoalGetter.GoalSetupIllustration.withdrawalSection.title")}
              description={t("GoalGetter.GoalSetupIllustration.withdrawalSection.description")}
              icon={<WithdrawalIcon color={iconColor} />}
            />
            <SavingPotSection
              title={t("GoalGetter.GoalSetupIllustration.depositSection.title")}
              description={t("GoalGetter.GoalSetupIllustration.depositSection.description")}
              icon={<CircleCurrencyIcon color={iconColor} />}
            />
          </Stack>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  IllustrationsStyle: { width: "100%" },
});
