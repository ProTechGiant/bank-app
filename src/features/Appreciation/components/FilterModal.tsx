import { cloneDeep, isEqual } from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, TextStyle, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import Chip from "@/components/Chip";
import Modal from "@/components/Modal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { FilterItemType, FiltersType } from "../types";

interface FilterModalProps {
  onClose: () => void;
  onApplyButtonPress: (updatedFilters: FiltersType | null) => void;
  isVisible: boolean;
  selectedFilters: FiltersType | null;
}

export default function FilterModal({ onClose, onApplyButtonPress, selectedFilters, isVisible }: FilterModalProps) {
  const { t } = useTranslation();

  const [filtersData, setFiltersData] = useState<FiltersType | null>(null);

  useEffect(() => {
    setFiltersData(selectedFilters);
  }, [selectedFilters]);

  const clearFilters = () => {
    const updatedFilters = cloneDeep(filtersData);
    for (const property in updatedFilters) {
      if (Array.isArray(updatedFilters[property])) {
        updatedFilters[property].forEach(item => {
          item.isActive = false;
        });
      }
    }
    setFiltersData(updatedFilters);
  };

  const onFilterItemPressed = (filterCategory: FilterItemType, index: number, isActive: boolean) => {
    const updatedFilters = cloneDeep(filtersData);
    updatedFilters[filterCategory][index].isActive = !isActive;
    setFiltersData(updatedFilters);
  };

  const clearAllButtonStyle = useThemeStyles<ViewStyle>(() => ({
    width: "100%",
  }));

  const clearAllTextStyle = useThemeStyles<TextStyle>(() => ({
    textDecorationLine: "underline",
  }));

  const categoryStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["32p"],
    paddingBottom: theme.spacing["48p"],
  }));

  const tagsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["12p"],
    flexWrap: "wrap",
  }));

  return (
    <Modal visible={isVisible} onClose={() => onClose()} headerText={t("Appreciation.HubScreen.filter")}>
      <Pressable onPress={() => clearFilters()} style={clearAllButtonStyle}>
        <Typography.Text
          color="primaryBase-40"
          weight="regular"
          size="footnote"
          align="right"
          style={clearAllTextStyle}>
          {t("Appreciation.HubScreen.clearAll")}
        </Typography.Text>
      </Pressable>
      <View style={categoryStyle}>
        {filtersData &&
          Object.keys(filtersData).map((filterCategory, index) => {
            return (
              <>
                {filterCategory !== "Sections" ? (
                  <Stack direction="vertical" gap="16p" key={index}>
                    <Typography.Text size="callout" color="neutralBase-10" weight="medium">
                      {t(`Appreciation.HubScreen.${filterCategory}FilterTitle`)}
                    </Typography.Text>
                    <Stack direction="horizontal" gap="12p" style={tagsContainerStyle}>
                      {filtersData[filterCategory]?.map((item, itemIndex) => {
                        return (
                          <Chip
                            onPress={() => onFilterItemPressed(filterCategory, itemIndex, item.isActive)}
                            title={item.Name}
                            isRemovable={false}
                            key={itemIndex}
                            isSelected={item.isActive}
                          />
                        );
                      })}
                    </Stack>
                  </Stack>
                ) : null}
              </>
            );
          })}
      </View>
      <Button onPress={() => onApplyButtonPress(filtersData)} disabled={isEqual(filtersData, selectedFilters)}>
        {t("Appreciation.HubScreen.apply")}
      </Button>
    </Modal>
  );
}
