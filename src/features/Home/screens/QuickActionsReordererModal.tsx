import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, View, ViewStyle } from "react-native";

import { CloseIcon } from "@/assets/icons";
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
import { ShortcutType } from "../types";

export default function QuickActionsReordererModal() {
  const navigation = useNavigation();
  const { t } = useTranslation("translation", { keyPrefix: "Home.QuickActionsReordererModal" });
  const addToast = useToasts();

  const { quickActions, setQuickActions } = useHomepageLayoutOrder();
  const [allItems, setAllItems] = useState<ShortcutType[]>([]);

  const numberOfActiveItems = allItems.reduce((accumulator, item) => {
    if (item.CustomerConfiguration.IsVisible) return accumulator + 1;
    return accumulator;
  }, 0);

  useEffect(() => {
    setAllItems(
      sortItemsByName(
        quickActions.map(action =>
          action.CustomerConfiguration.IsVisible === false
            ? { ...action, CustomerConfiguration: { ...action.CustomerConfiguration, SectionIndex: -1 } }
            : action
        )
      )
    );
  }, [quickActions]);

  const sortItemsByName = <Type extends { Name: string }>(items: Type[]): Type[] => {
    items.sort((a, b) => (a.Name.toUpperCase() > b.Name.toUpperCase() ? 1 : -1));
    return items;
  };

  const handleOnCloseModal = () => {
    navigation.goBack();
  };

  const handleOnSavePress = () => {
    setQuickActions(allItems);
    handleOnCloseModal();
  };

  const handleOnDeletePress = (item: ShortcutType) => {
    const {
      CustomerConfiguration: { SectionIndex: itemSectionIndex },
    } = item;
    setAllItems(items =>
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

  const handleOnAddPress = (item: ShortcutType) => {
    if (numberOfActiveItems !== REQUIRED_ACTIVE_ITEMS)
      setAllItems(items =>
        items.map(i => {
          if (i.Id !== item.Id) return i;
          return { ...i, CustomerConfiguration: { IsVisible: true, SectionIndex: numberOfActiveItems } };
        })
      );
    else addToast({ variant: "warning", message: t("maxQuickActionsWarning"), position: "bottom" });
  };

  const handleOnChangeItemPress = (itemId: string) => {
    const item = allItems.find(i => i.Id === itemId);
    if (item?.CustomerConfiguration.IsVisible) handleOnDeletePress(item);
    else if (item) handleOnAddPress(item);
  };

  const pageStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-20-30%"],
    height: "100%",
  }));

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    height: "85%",
    position: "absolute",
    bottom: 0,
    backgroundColor: theme.palette["neutralBase-60"],
    borderRadius: theme.spacing["16p"],
  }));

  const headerStyle = useThemeStyles<ViewStyle>(() => ({
    flexDirection: "column-reverse",
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

  const iconColor = useThemeStyles(theme => theme.palette.neutralBase);

  return (
    <View style={pageStyle}>
      <Stack direction="vertical" style={containerStyle}>
        <Page insets={["bottom", "left", "right"]}>
          <View style={headerStyle}>
            <NavHeader
              backButton={<CloseIcon width={20} height={20} color={iconColor} />}
              end={
                <Pressable
                  accessibilityState={{ disabled: numberOfActiveItems !== REQUIRED_ACTIVE_ITEMS }}
                  onPress={handleOnSavePress}
                  disabled={numberOfActiveItems !== REQUIRED_ACTIVE_ITEMS}>
                  <Typography.Text
                    color={numberOfActiveItems === REQUIRED_ACTIVE_ITEMS ? "primaryBase-40" : "neutralBase-20"}>
                    {t("saveButton")}
                  </Typography.Text>
                </Pressable>
              }
              title={t("title")}
              onBackPress={handleOnCloseModal}
            />
          </View>
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
              {[...Array(numberOfActiveItems)].map((_, index) => {
                return allItems.map(item => {
                  return item.CustomerConfiguration.IsVisible && index === item.CustomerConfiguration.SectionIndex ? (
                    <QuickAction key={item.Id} color="complimentBase" image={item["Shortcut Icon"]} />
                  ) : null;
                });
              })}
              {[...Array(REQUIRED_ACTIVE_ITEMS - numberOfActiveItems)].map((_, index) => {
                return (
                  <QuickAction
                    backgroundColor="neutralBase-40"
                    key={`id-${index}`}
                    color="neutralBase-30"
                    icon={iconMapping.homepageQuickActions.plus}
                  />
                );
              })}
            </Stack>
            <Stack direction="vertical">
              {allItems.map(item => (
                <QuickActionToggle
                  key={item.Id}
                  image={item["Shortcut Icon"]}
                  title={item.Name}
                  description={item.Description}
                  onPress={() => handleOnChangeItemPress(item.Id)}
                  isActive={item.CustomerConfiguration.IsVisible}
                />
              ))}
            </Stack>
          </ScrollView>
        </Page>
      </Stack>
    </View>
  );
}

const REQUIRED_ACTIVE_ITEMS = 3;
