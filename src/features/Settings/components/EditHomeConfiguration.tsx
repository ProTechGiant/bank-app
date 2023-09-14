import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, TextStyle, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { warn } from "@/logger";
import { useThemeStyles } from "@/theme";

import { useHomepageLayout, usePostHomepageLayout } from "../hooks/query-hooks";
import { EditHomeConfigurationProps, HomePageLayoutResponse } from "../types";
import DraggableItem from "./DraggableItem";
import HeaderEditHome from "./HeaderEditHome";

export default function EditHomeConfiguration({ isVisible, onClose }: EditHomeConfigurationProps) {
  const navigation = useNavigation();

  const { t } = useTranslation();

  const [sections, setSections] = useState<HomePageLayoutResponse[]>([]);
  const [selectedCount, setSelectedCount] = useState(() => {
    return sections.reduce((count, item) => (item.isItemChecked ? count + 1 : count), 0);
  });

  const homepageLayout = useHomepageLayout();
  const postHomepageLayout = usePostHomepageLayout();
  const [initialSections, setInitialSections] = useState<HomePageLayoutResponse[]>([]);

  useEffect(() => {
    homepageLayout.data?.tabs.forEach(data => {
      data.sections.forEach(section => {
        if (section.name === "Homepage Layout") {
          setSections(section.widgets);
          setInitialSections(section.widgets);
        }
      });
    });
  }, [homepageLayout.data?.tabs]);

  useEffect(() => {
    const count = sections.filter(item => item.isItemChecked).length;
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
          tabs: [
            {
              name: "Homepage",
              sections: [{ name: "Homepage Layout", widgets: sections }],
            },
          ],
        },
      });

      const resetSections = sections.map(item => ({ ...item, isItemChecked: false }));
      setSections(resetSections);
      navigation.goBack();
    } catch (err) {
      warn("Homepage Configurations", "Could not change homepage Configurations", JSON.stringify(err));
    }
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    justifyContent: "flex-end",
    // TODO: Temp background color as it's not found in core theme and design is not finished
    backgroundColor: theme.palette["neutralBase-20-30%"],
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    paddingHorizontal: theme.spacing["12p"],
  }));

  const sectionsTextStyle = useThemeStyles<TextStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
    paddingHorizontal: theme.spacing["4p"],
  }));

  return (
    <Modal transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={containerStyle}>
        <HeaderEditHome handleOnClose={handleOnCloseModal} handleOnSave={handleOnSave} disabled={selectedCount < 4} />
        <View style={contentStyle}>
          <Typography.Text color="neutralBase-10" size="callout" weight="medium" style={sectionsTextStyle}>
            {t("Settings.HomeCustomization.sections")}
          </Typography.Text>

          <DraggableItem data={sections} onDragEnd={onDragEnd} />
        </View>
      </View>
    </Modal>
  );
}
