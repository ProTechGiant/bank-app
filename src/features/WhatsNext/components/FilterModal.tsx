import { isEmpty, isEqual, xorWith } from "lodash";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import Chip from "@/components/Chip";
import Modal from "@/components/Modal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { FilterItemType } from "../types";

interface FilterModalProps {
  onClose: () => void;
  isVisible: boolean;
  initialCategories: FilterItemType[];
  initialTypes: FilterItemType[];
  onFiltersApplyPress: (categories: FilterItemType[], types: FilterItemType[]) => void;
}

export default function FilterModal({
  onClose,
  isVisible,
  onFiltersApplyPress,
  initialCategories,
  initialTypes,
}: FilterModalProps) {
  const { t } = useTranslation();

  const [whatsNextCategories, setWhatsNextCategories] = useState(initialCategories);
  const [whatsNextTypes, setWhatsNextTypes] = useState(initialTypes);

  const handleOnClearFiltersPress = () => {
    setWhatsNextTypes(
      whatsNextTypes.map(item => {
        if (item.isActive === false) {
          return item;
        }
        return {
          name: item.name,
          isActive: false,
        };
      })
    );
    setWhatsNextCategories(
      whatsNextCategories.map(item => {
        if (item.isActive === false) {
          return item;
        }
        return {
          name: item.name,
          isActive: false,
        };
      })
    );
  };

  const handleOnTypeFilterItemPress = (index: number) => {
    setWhatsNextTypes(
      whatsNextTypes.map((item, ind) => {
        if (ind !== index) {
          return item;
        }
        return {
          ...item,
          isActive: !item.isActive,
        };
      })
    );
  };

  const handleOnCategoryFilterItemPress = (index: number) => {
    setWhatsNextCategories(
      whatsNextCategories.map((item, ind) => {
        if (ind !== index) {
          return item;
        }
        return {
          ...item,
          isActive: !item.isActive,
        };
      })
    );
  };

  const modalStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
    marginHorizontal: theme.spacing["16p"],
  }));

  const clearAllStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    alignSelf: "flex-end",
    paddingTop: theme.spacing["8p"],
  }));

  const chipContainerStyle = useThemeStyles<ViewStyle>(theme => ({ marginVertical: theme.spacing["8p"] }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["48p"],
    paddingBottom: theme.spacing["16p"],
  }));

  return (
    <Modal visible={isVisible} style={modalStyle} onClose={onClose} headerText={t("WhatsNext.HubScreen.filter")}>
      <Pressable style={clearAllStyle} onPress={handleOnClearFiltersPress}>
        <Typography.Text color="primaryBase-40" size="footnote">
          {t("WhatsNext.HubScreen.clearAll")}
        </Typography.Text>
      </Pressable>
      <Stack direction="vertical" gap="16p" align="flex-start" style={contentStyle}>
        <Typography.Text color="neutralBase-10" size="callout">
          {t("WhatsNext.HubScreen.type")}
        </Typography.Text>
        <Stack direction="horizontal" gap="12p" style={styles.flexWrap}>
          {whatsNextTypes.map((data, index) => {
            return (
              <View key={data.name} style={chipContainerStyle}>
                <Chip
                  title={data.name}
                  isEnabled={data.isActive}
                  isClosable={false}
                  onPress={() => handleOnTypeFilterItemPress(index)}
                />
              </View>
            );
          })}
        </Stack>
        <Typography.Text color="neutralBase-10" size="callout">
          {t("WhatsNext.HubScreen.category")}
        </Typography.Text>
        <Stack direction="horizontal" gap="12p" style={styles.flexWrap}>
          {whatsNextCategories.map((data, index) => {
            return (
              <View key={data.name} style={chipContainerStyle}>
                <Chip
                  title={data.name}
                  isEnabled={data.isActive}
                  isClosable={false}
                  onPress={() => handleOnCategoryFilterItemPress(index)}
                />
              </View>
            );
          })}
        </Stack>
      </Stack>
      <View style={buttonContainerStyle}>
        <Button
          onPress={() => onFiltersApplyPress(whatsNextCategories, whatsNextTypes)}
          disabled={
            isEmpty(xorWith(initialCategories, whatsNextCategories, isEqual)) &&
            isEmpty(xorWith(initialTypes, whatsNextTypes, isEqual))
          }>
          {t("WhatsNext.HubScreen.apply")}
        </Button>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flexWrap: {
    flexWrap: "wrap",
  },
});
