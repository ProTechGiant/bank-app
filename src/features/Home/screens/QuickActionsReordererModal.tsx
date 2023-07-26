import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LogBox, Pressable, ScrollView, ViewStyle } from "react-native";

import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useToasts } from "@/contexts/ToastsContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { iconMapping } from "@/utils/icon-mapping";

import { QuickAction, QuickActionToggle } from "../components";
import { useHomepageLayoutOrder } from "../contexts/HomepageLayoutOrderContext";
import { HomepageItemLayoutType } from "../types";

interface quickActionsType extends HomepageItemLayoutType {
  isActive: boolean;
}
export default function QuickActionsReordererModal() {
  const navigation = useNavigation();
  const { t } = useTranslation("translation", { keyPrefix: "Home.QuickActionsReordererModal" });
  const addToast = useToasts();

  const { quickActions, setQuickActions } = useHomepageLayoutOrder();
  const [activeItems, setActiveItems] = useState(
    quickActions !== undefined ? () => quickActions?.slice(0, REQUIRED_ACTIVE_ITEMS) : []
  );
  const [allItems, setAllItems] = useState<quickActionsType[]>([]);

  useEffect(() => {
    setActiveItems(quickActions.slice(0, REQUIRED_ACTIVE_ITEMS));
    setAllItems(
      sortItemsByName(
        quickActions.map((action, index) => {
          return { ...action, isActive: index <= 2 };
        })
      )
    );
  }, [quickActions]);

  const isSaveButtonActive = activeItems.length === 3;

  const sortItemsByName = <Type extends { name: string }>(items: Type[]): Type[] => {
    items.sort((a, b) => (a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1));
    return items;
  };

  const handleOnCloseModal = () => {
    navigation.goBack();
  };

  const handleOnSavePress = () => {
    setQuickActions([...activeItems, ...allItems.filter(item => !item.isActive)]);
    handleOnCloseModal();
  };

  const handleOnDeletePress = (item: HomepageItemLayoutType) => {
    setActiveItems(items => items.filter(i => i.type !== item.type));
    setAllItems(items =>
      items.map(i => {
        if (i.type !== item.type) return i;
        return { ...i, isActive: false };
      })
    );
  };

  const handleOnAddPress = (item: HomepageItemLayoutType) => {
    if (activeItems.length < 3) {
      setActiveItems(items => [...items, item]);
      setAllItems(items =>
        items.map(i => {
          if (i.type !== item.type) return i;
          return { ...i, isActive: true };
        })
      );
    } else addToast({ variant: "warning", message: t("maxQuickActionsWarning"), position: "bottom" });
  };

  const handleOnChangeItemPress = (itemType: string) => {
    const item = allItems.find(i => i.type === itemType);
    if (item?.isActive) handleOnDeletePress(item);
    else if (item) handleOnAddPress(item);
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    height: "85%",
    position: "absolute",
    bottom: 0,
    backgroundColor: theme.palette["neutralBase-60"],
    borderRadius: theme.spacing["16p"],
  }));

  const descriptionTextStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["16p"],
    width: "80%",
    alignSelf: "center",
  }));

  const activeItemsStyle = useThemeStyles<ViewStyle>(() => ({
    width: "65%",
    alignSelf: "center",
  }));

  return (
    <>
      <Stack direction="vertical" style={containerStyle}>
        <Page insets={["bottom", "left", "right"]}>
          <NavHeader
            end={
              <Pressable accessibilityState={{ disabled: !isSaveButtonActive }} onPress={handleOnSavePress}>
                <Typography.Text color={isSaveButtonActive ? "primaryBase-40" : "neutralBase-20"}>
                  {t("saveButton")}
                </Typography.Text>
              </Pressable>
            }
            title={t("title")}
            onBackPress={handleOnCloseModal}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            <Typography.Text
              size="footnote"
              weight="regular"
              color="neutralBase"
              align="center"
              style={descriptionTextStyle}>
              {t("subtitle")}
            </Typography.Text>
            <Stack direction="horizontal" style={activeItemsStyle}>
              {activeItems.map(item => (
                <QuickAction
                  key={item.type}
                  color="complimentBase"
                  title={item.name}
                  icon={iconMapping.homepageQuickActions[item.type]}
                  withTitle={false}
                />
              ))}
              {[...Array(REQUIRED_ACTIVE_ITEMS - activeItems.length)].map((_, index) => {
                return (
                  <QuickAction
                    key={index}
                    color="neutralBase-30"
                    title=""
                    icon={iconMapping.homepageQuickActions.plus}
                    withTitle={false}
                  />
                );
              })}
            </Stack>
            <Stack direction="vertical">
              {allItems.map(item => (
                <QuickActionToggle
                  key={item.type}
                  icon={iconMapping.homepageQuickActions[item.type]}
                  title={item.name}
                  type={item.type}
                  description={item.description}
                  onPress={handleOnChangeItemPress}
                  isActive={item.isActive}
                />
              ))}
            </Stack>
          </ScrollView>
        </Page>
      </Stack>
    </>
  );
}

// ignored. Virtualization is DISABLED on the DraggableFlatList so this is a false-positive
LogBox.ignoreLogs(["VirtualizedLists should never"]);

const REQUIRED_ACTIVE_ITEMS = 3;
