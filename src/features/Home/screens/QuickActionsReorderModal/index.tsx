import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LogBox, ScrollView, ViewStyle } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import ActiveReordererItem from "../../components/ActiveReordererItem";
import InactiveReordererItem from "../../components/InactiveReordererItem";
import LoadingError from "../../components/LoadingError";
import PlaceholderGenerator from "../../components/PlaceholderGenerator";
import ReordererHeader from "../../components/ReordererHeader";
import ReordererSection from "../../components/ReordererSection";
import { useHomepageLayoutOrder } from "../../contexts/HomepageLayoutOrderContext";
import { useRefetchHomepageLayout } from "../../hooks/query-hooks";
import { HomepageItemLayoutType } from "../../types";

export default function QuickActionsReordererModal() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { quickActions, setQuickActions, homepageLayout } = useHomepageLayoutOrder();
  const { refetchAll } = useRefetchHomepageLayout();

  const [activeItems, setActiveItems] = useState(
    quickActions !== undefined ? () => quickActions?.slice(0, REQUIRED_ACTIVE_ITEMS) : []
  );
  const [inactiveItems, setInactiveItems] = useState(
    quickActions ? () => quickActions?.slice(REQUIRED_ACTIVE_ITEMS) : []
  );

  const handleOnCancelPress = () => {
    navigation.goBack();
  };

  const handleOnSavePress = () => {
    setQuickActions([...activeItems, ...inactiveItems]);

    navigation.goBack();
  };

  const handleOnDeletePress = (item: HomepageItemLayoutType) => {
    setActiveItems(items => items?.filter(i => i.type !== item.type));
    setInactiveItems(items => [item, ...items]);
  };

  const handleOnAddPress = (item: HomepageItemLayoutType) => {
    setActiveItems(items => [...items, item]);
    setInactiveItems(items => items?.filter(i => i.type !== item.type));
  };

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["20p"],
    rowGap: theme.spacing["8p"],
  }));

  return (
    <SafeAreaProvider>
      <Page insets={["bottom", "left", "right"]}>
        {quickActions !== undefined ? (
          <>
            <ReordererHeader
              cancelText={t("Home.QuickActionsReordererModal.cancelButton")}
              onCancelPress={handleOnCancelPress}
              onSavePress={handleOnSavePress}
              isSaveable={activeItems.length >= REQUIRED_ACTIVE_ITEMS}
              saveText={t("Home.QuickActionsReordererModal.saveButton")}
              title={t("Home.QuickActionsReordererModal.title")}
            />
            <ScrollView contentContainerStyle={contentStyle}>
              <ReordererSection count={activeItems.length} max={REQUIRED_ACTIVE_ITEMS} title="ACTIVE">
                <DraggableFlatList
                  data={activeItems}
                  onDragEnd={({ data }) => setActiveItems(data)}
                  keyExtractor={item => item.type}
                  disableVirtualization
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
              <ReordererSection title="NEW ACTIONS">
                {inactiveItems.map(element => (
                  <InactiveReordererItem
                    key={element.type}
                    disabled={activeItems.length >= REQUIRED_ACTIVE_ITEMS}
                    onPress={() => handleOnAddPress(element)}
                    item={element}
                  />
                ))}
              </ReordererSection>
            </ScrollView>
          </>
        ) : homepageLayout?.error ? (
          <LoadingError
            onRefresh={() => {
              refetchAll();
            }}
          />
        ) : null}
      </Page>
    </SafeAreaProvider>
  );
}

// ignored. Virtualization is DISABLED on the DraggableFlatList so this is a false-positive
LogBox.ignoreLogs(["VirtualizedLists should never"]);

const REQUIRED_ACTIVE_ITEMS = 3;
