import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, ViewStyle } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { LoadingErrorPage } from "@/components/LoadingError";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { HomepageItemLayoutType } from "@/types/Homepage";

import {
  ActiveReordererItem,
  InactiveReordererItem,
  PlaceholderGenerator,
  ReordererHeader,
  ReordererSection,
} from "../components";
import { useHomepageContent } from "../contexts/HomepageContentContext";
import { useRefetchHomepageLayout } from "../hooks/query-hooks";

export default function SectionsReordererModal() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { sections, setSections, isError } = useHomepageContent();
  const { refetchAll } = useRefetchHomepageLayout();

  const [activeItems, setActiveItems] = useState(sections ? () => sections?.slice(0, REQUIRED_ACTIVE_ITEMS) : []);
  const [inactiveItems, setInactiveItems] = useState(sections ? () => sections?.slice(REQUIRED_ACTIVE_ITEMS) : []);

  const handleOnCancelPress = () => {
    navigation.goBack();
  };

  const handleOnSavePress = () => {
    setSections([...activeItems, ...inactiveItems]);

    navigation.goBack();
  };

  const handleOnDeletePress = (item: HomepageItemLayoutType) => {
    setActiveItems(items => items?.filter(i => i.WidgetType !== item.WidgetType));
    setInactiveItems(items => [item, ...items]);
  };

  const handleOnAddPress = (item: HomepageItemLayoutType) => {
    setActiveItems(items => [...items, item]);
    setInactiveItems(items => items?.filter(i => i.WidgetType !== item.WidgetType));
  };

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["20p"],
    rowGap: theme.spacing["8p"],
  }));

  return (
    <SafeAreaProvider>
      {sections !== undefined ? (
        <Page insets={["bottom", "left", "right"]}>
          <ReordererHeader
            cancelText={t("Home.SectionsReordererModal.cancelButton")}
            onCancelPress={handleOnCancelPress}
            onSavePress={handleOnSavePress}
            isSaveable={activeItems.length >= REQUIRED_ACTIVE_ITEMS}
            saveText={t("Home.SectionsReordererModal.saveButton")}
            title={t("Home.SectionsReordererModal.title")}
          />
          <ScrollView contentContainerStyle={contentStyle}>
            <ReordererSection title="ACTIVE">
              <DraggableFlatList
                data={activeItems}
                onDragEnd={({ data }) => setActiveItems(data)}
                keyExtractor={item => item.WidgetType}
                ListFooterComponent={<PlaceholderGenerator amount={REQUIRED_ACTIVE_ITEMS - activeItems.length} />}
                renderItem={({ isActive, item, drag }) => {
                  return (
                    <ActiveReordererItem
                      onDeletePress={() => handleOnDeletePress(item)}
                      onPress={drag}
                      isActive={isActive}
                      item={item}
                    />
                  );
                }}
              />
            </ReordererSection>
            <ReordererSection title="NEW SECTIONS">
              {inactiveItems.map(element => (
                <InactiveReordererItem
                  key={element.WidgetType}
                  disabled={activeItems.length >= REQUIRED_ACTIVE_ITEMS}
                  onPress={() => handleOnAddPress(element)}
                  item={element}
                />
              ))}
            </ReordererSection>
          </ScrollView>
        </Page>
      ) : isError ? (
        <LoadingErrorPage
          onRefresh={() => {
            refetchAll();
          }}
        />
      ) : null}
    </SafeAreaProvider>
  );
}

const REQUIRED_ACTIVE_ITEMS = 4;
