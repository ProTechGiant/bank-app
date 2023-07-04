import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import CloseEndButton from "@/components/Alert/CloseEndButton";
import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import Typography from "@/components/Typography";
import useThemeStyles from "@/theme/use-theme-styles";

import SelectedCircle from "../assets/SelectedCircleIcon";
import UnSelectCircle from "../assets/UnSelectCircleIcon";
import { ListItemType } from "../types";

interface DropdownBottomSheetProps {
  isVisible: boolean;
  items: ListItemType[];
  onSelect: (item: string) => void;
  onCancel: () => void;
  title: string;
  isButtonDisabled: boolean;
  onChange: (data: ListItemType[]) => void;
  onChangeButtonVisibility: (isViewing: boolean) => void;
  selectedItem?: string;
  onChangeSelectedItem: (label: string) => void;
}

export default function DropdownBottomSheet({
  isVisible,
  items,
  onCancel,
  title,
  isButtonDisabled,
  onChange,
  onChangeButtonVisibility,
  onChangeSelectedItem,
}: DropdownBottomSheetProps) {
  const { t } = useTranslation();

  const handleOnItemSelect = () => {
    onCancel();
    onChangeButtonVisibility(!isButtonDisabled);
  };

  const handleOnCancel = () => {
    onCancel();
    onChangeButtonVisibility(true);
  };

  const handleOnSelect = (listItem: ListItemType) => {
    const newItems = items.map(item => {
      if (item.item === listItem.item) {
        onChangeSelectedItem(item.item);
        return { ...item, isSelected: true };
      } else return { ...item, isSelected: false };
    });

    onChange(newItems);
    onChangeButtonVisibility(false);
  };

  const bottomSheetStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    borderTopLeftRadius: theme.spacing["18p"],
    borderTopRightRadius: theme.spacing["18p"],
    padding: theme.spacing["20p"],
    flex: 1,
    marginTop: theme.spacing["16p"],
  }));

  const bottomSheetContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: theme.palette["neutralBase-20-30%"],
  }));

  const selectedTextStyle = useThemeStyles<TextStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
  }));

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={bottomSheetContainerStyle}>
        <View style={bottomSheetStyle}>
          <NavHeader title={title} end={<CloseEndButton onPress={handleOnCancel} />} />
          <ScrollView>
            {items.map(item => (
              <View key={item.item}>
                <Pressable style={selectedTextStyle} onPress={() => handleOnSelect(item)}>
                  {item.isSelected ? (
                    <View style={styles.containerStyles}>
                      <Typography.Text size="callout" weight="regular">
                        {item.item}
                      </Typography.Text>
                      <SelectedCircle />
                    </View>
                  ) : (
                    <View style={styles.containerStyles}>
                      <Typography.Text size="callout" weight="regular">
                        {item.item}
                      </Typography.Text>
                      <UnSelectCircle />
                    </View>
                  )}
                </Pressable>
              </View>
            ))}
          </ScrollView>
          <View>
            <Button onPress={handleOnItemSelect} disabled={isButtonDisabled}>
              {t("Settings.FinancialInformation.selectButton")}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
