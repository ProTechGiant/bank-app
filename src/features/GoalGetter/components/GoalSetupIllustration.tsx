import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Modal, StyleSheet, View, ViewStyle } from "react-native";

import { CloseIcon } from "@/assets/icons";
import { Stack } from "@/components";
import NavHeader from "@/components/NavHeader";
import { useSavingPotDetails } from "@/hooks/use-content";
import { useThemeStyles } from "@/theme";

import Illustrations from "../assets/Illustrations.png";
import { useSavingPotCategoryId } from "../hooks/query-hooks";
import SavingPotSection from "./SavingPotSection";

interface GoalSetupIllustrationModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function GoalSetupIllustration({ isVisible, onClose }: GoalSetupIllustrationModalProps) {
  const { t } = useTranslation();
  const { data: ContentCategoryId } = useSavingPotCategoryId();
  const { data: SavingPotDetails } = useSavingPotDetails(ContentCategoryId?.DescriptionId);

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
            {SavingPotDetails?.map((item, index) => (
              <SavingPotSection
                key={index}
                title={item.Title}
                description={item.ContentDescription}
                imageUrl={item.Media[0]?.SourceFileURL}
              />
            )) ?? null}
          </Stack>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  IllustrationsStyle: { width: "100%" },
});
