import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import Stack from "@/components/Stack";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";

import { useHomepageLayoutOrder } from "../contexts/HomepageLayoutOrderContext";
import QuickAction from "./QuickAction";
import RefreshSection from "./RefreshSection";

interface QuickActionsSectionProps {
  onQuickActionPress: (screen: string, stack: keyof AuthenticatedStackParams) => void;
  onRefresh: () => void;
}

export default function QuickActionsSection({ onQuickActionPress, onRefresh }: QuickActionsSectionProps) {
  const { t } = useTranslation();
  const { quickActions } = useHomepageLayoutOrder();

  return (
    <Stack direction="vertical" align="stretch" gap="12p">
      <Stack align="stretch" direction="horizontal" justify="space-between">
        {quickActions.length !== 0 ? (
          <>
            {quickActions
              .sort((item1, item2) =>
                item1.CustomerConfiguration.SectionIndex !== undefined &&
                item2.CustomerConfiguration.SectionIndex !== undefined &&
                item1.CustomerConfiguration.SectionIndex > item2.CustomerConfiguration.SectionIndex
                  ? 1
                  : -1
              )
              .map(item =>
                item.CustomerConfiguration.IsVisible ? (
                  <QuickAction
                    key={item.Id}
                    color="neutralBase+30"
                    iconName={item["Shortcut Icon"]}
                    backgroundColor="supportBase-10"
                    onPress={() => onQuickActionPress(item.Link?.screen, item.Link?.stack)}
                    title={item.Name}
                  />
                ) : null
              )}
          </>
        ) : (
          <View style={styles.quickActionRefreshSectionView}>
            <RefreshSection
              hint={t("Home.DashboardScreen.QuickActionSectionRefreshSectionHint")}
              onRefreshPress={onRefresh}
              hasBorder={true}
            />
          </View>
        )}
      </Stack>
    </Stack>
  );
}

const styles = StyleSheet.create({
  quickActionRefreshSectionView: {
    width: "100%",
  },
});
