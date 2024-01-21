import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, TextStyle } from "react-native";

import Modal from "@/components/Modal";
import Typography from "@/components/Typography";
import { useHomeConfiguration, usePostHomeConfigurations } from "@/hooks/use-homepage";
import { warn } from "@/logger";
import { useThemeStyles } from "@/theme";
import { HomepageItemLayoutType } from "@/types/Homepage";

import { EditHomeConfigurationProps } from "../types";
import DraggableItem from "./DraggableItem";
import HeaderEditHome from "./HeaderEditHome";

export default function EditHomeConfiguration({ isVisible, onClose }: EditHomeConfigurationProps) {
  const navigation = useNavigation();

  const { t } = useTranslation();

  const [sections, setSections] = useState<HomepageItemLayoutType[]>([]);
  const [selectedCount, setSelectedCount] = useState(() => {
    return sections.reduce((count, item) => (item.CustomerConfiguration.IsVisible ? count + 1 : count), 0);
  });

  const { data: homepageConfigurations } = useHomeConfiguration();
  const postHomepageLayout = usePostHomeConfigurations();
  const [initialSections, setInitialSections] = useState<HomepageItemLayoutType[]>([]);

  useEffect(() => {
    if (homepageConfigurations?.Layouts !== undefined) {
      setSections(homepageConfigurations?.Layouts);
      setInitialSections(homepageConfigurations?.Layouts);
    }
  }, [homepageConfigurations?.Layouts]);

  useEffect(() => {
    const count = sections.filter(item => item.CustomerConfiguration.IsVisible).length;
    setSelectedCount(count);
  }, [sections]);

  const handleOnCloseModal = () => {
    setSections(initialSections);
    onClose();
  };

  const onDragEnd = (newData: typeof sections) => {
    setSections(newData);
  };

  const handleOnSave = async () => {
    try {
      await postHomepageLayout.mutateAsync({
        values: {
          Homepage: {
            Sections: sections,
            HeroFeatures: homepageConfigurations?.HeroFeatures || [],
            Shortcuts: homepageConfigurations?.Shortcuts || [],
          },
        },
      });

      const resetSections = sections.map(item => ({
        ...item,
        CustomerConfiguration: { ...item.CustomerConfiguration, isVisible: false },
      }));
      setSections(resetSections);
      navigation.goBack();
    } catch (err) {
      warn("Homepage Configurations", "Could not change homepage Configurations", JSON.stringify(err));
    }
  };

  const sectionsTextStyle = useThemeStyles<TextStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
    paddingHorizontal: theme.spacing["4p"],
  }));

  return (
    <Modal visible={isVisible}>
      <HeaderEditHome handleOnClose={handleOnCloseModal} handleOnSave={handleOnSave} disabled={false} />
      <ScrollView>
        <Typography.Text color="neutralBase-10" size="callout" weight="medium" style={sectionsTextStyle}>
          {t("Settings.HomeCustomization.sections")}
        </Typography.Text>
        <DraggableItem data={sections} onDragEnd={onDragEnd} />
      </ScrollView>
    </Modal>
  );
}
