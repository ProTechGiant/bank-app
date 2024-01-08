import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, StyleSheet } from "react-native";

import { CloseIcon } from "@/assets/icons";
import Modal from "@/components/Modal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { QuickActionType } from "@/types/Homepage";
import { sortItemsByName } from "@/utils/sort-item-by-name";

import { QuickAction, QuickActionToggle } from "../components";
import { useHomepageContent } from "../contexts/HomepageContentContext";

interface QuickActionsReordererModalProps {
  isVisible: boolean;
  onClose: () => void;
  testID?: string;
}

export default function QuickActionsReordererModal({ isVisible, onClose, testID }: QuickActionsReordererModalProps) {
  const { t } = useTranslation();

  const { quickActions, setQuickActions } = useHomepageContent();
  const [selectedQuickActions, setSelectedQuickActions] = useState<QuickActionType[]>([]);

  const numberOfActiveItems = selectedQuickActions.reduce((accumulator, item) => {
    if (item.CustomerConfiguration.IsVisible) return accumulator + 1;
    return accumulator;
  }, 0);

  useEffect(() => {
    setSelectedQuickActions(
      sortItemsByName(
        quickActions.map(action =>
          action.CustomerConfiguration.IsVisible === false
            ? { ...action, CustomerConfiguration: { ...action.CustomerConfiguration, SectionIndex: -1 } }
            : action
        )
      )
    );
  }, [quickActions, isVisible]);

  const handleOnSavePress = () => {
    setQuickActions(selectedQuickActions);
    onClose();
  };

  const handleOnDeletePress = (item: QuickActionType) => {
    const {
      CustomerConfiguration: { SectionIndex: itemSectionIndex },
    } = item;
    setSelectedQuickActions(items =>
      items.map(i => {
        const {
          CustomerConfiguration: { SectionIndex, IsVisible },
        } = i;
        if (i.Id !== item.Id) {
          if (
            IsVisible &&
            SectionIndex !== undefined &&
            itemSectionIndex !== undefined &&
            SectionIndex > itemSectionIndex
          ) {
            return { ...i, CustomerConfiguration: { SectionIndex: SectionIndex - 1, IsVisible: true } };
          } else return i;
        }
        return { ...i, CustomerConfiguration: { IsVisible: false, SectionIndex: -1 } };
      })
    );
  };

  const handleOnAddPress = (item: QuickActionType) => {
    if (numberOfActiveItems !== REQUIRED_ACTIVE_ITEMS)
      setSelectedQuickActions(items =>
        items.map(i => {
          if (i.Id !== item.Id) return i;
          return { ...i, CustomerConfiguration: { IsVisible: true, SectionIndex: numberOfActiveItems } };
        })
      );
  };

  const handleOnChangeItemPress = (itemId: string) => {
    const item = selectedQuickActions.find(i => i.Id === itemId);
    if (item?.CustomerConfiguration.IsVisible) handleOnDeletePress(item);
    else if (item) handleOnAddPress(item);
  };

  const iconColor = useThemeStyles(theme => theme.palette.neutralBase);

  return (
    <Modal
      testID={testID !== undefined ? `${testID}-Modal` : undefined}
      visible={isVisible}
      style={style.quickActionsReordererModalStyle}>
      <Stack direction="vertical" align="stretch" gap="32p">
        <Stack direction="horizontal" justify="space-between">
          <Pressable testID={testID !== undefined ? `${testID}-IconColorButton` : undefined} onPress={onClose}>
            <CloseIcon color={iconColor} />
          </Pressable>
          <Typography.Text color="neutralBase+20" size="callout" weight="medium">
            {t("Home.QuickActionsReordererModal.yourShortcutsLabel")}
          </Typography.Text>
          <Pressable
            testID={testID !== undefined ? `${testID}-SaveButton` : undefined}
            accessibilityState={{ disabled: numberOfActiveItems !== REQUIRED_ACTIVE_ITEMS }}
            onPress={handleOnSavePress}
            disabled={numberOfActiveItems !== REQUIRED_ACTIVE_ITEMS}>
            <Typography.Text
              color={numberOfActiveItems !== REQUIRED_ACTIVE_ITEMS ? "neutralBase-30" : "neutralBase+30"}
              size="callout"
              weight="medium">
              {t("Home.QuickActionsReordererModal.saveButton")}
            </Typography.Text>
          </Pressable>
        </Stack>
        <Stack direction="horizontal" style={style.selectedIconsStyle}>
          {[...Array(numberOfActiveItems)].map((_, index) => {
            return selectedQuickActions.map(item => {
              return item.CustomerConfiguration.IsVisible && index === item.CustomerConfiguration.SectionIndex ? (
                <QuickAction
                  testID={testID !== undefined ? `${testID}:QuictionAction` : undefined}
                  key={item.Id}
                  backgroundColor="neutralBase-40"
                  color="neutralBase+30"
                  iconName={item["Shortcut Icon"]}
                  borederRaduisSize="xlarge"
                />
              ) : null;
            });
          })}
          {[
            ...Array(REQUIRED_ACTIVE_ITEMS - numberOfActiveItems < 0 ? 0 : REQUIRED_ACTIVE_ITEMS - numberOfActiveItems),
          ].map((_, index) => {
            return (
              <QuickAction
                backgroundColor="neutralBase-40"
                key={`id-${index}`}
                color="neutralBase-30"
                iconName="plus"
                states="Placeholder"
                testID={testID !== undefined ? `${testID}:QuickAction` : undefined}
              />
            );
          })}
        </Stack>
        <FlatList
          style={style.quickActionsFlatListStyle}
          showsVerticalScrollIndicator={false}
          data={selectedQuickActions}
          keyExtractor={item => item.Id}
          renderItem={({ item }) => {
            return (
              <QuickActionToggle
                testID={testID !== undefined ? `${testID}-QuickActionToggle}` : undefined}
                key={item.Id}
                iconName={item["Shortcut Icon"]}
                title={item.Name}
                description={item.Description}
                onPress={() => handleOnChangeItemPress(item.Id)}
                isActive={item.CustomerConfiguration.IsVisible}
                numberOfActiveItems={numberOfActiveItems}
              />
            );
          }}
        />
      </Stack>
    </Modal>
  );
}

const REQUIRED_ACTIVE_ITEMS = 3;

const style = StyleSheet.create({
  quickActionsFlatListStyle: {
    height: "75%",
  },
  quickActionsReordererModalStyle: { height: "90%" },
  selectedIconsStyle: {
    justifyContent: "space-around",
  },
});
