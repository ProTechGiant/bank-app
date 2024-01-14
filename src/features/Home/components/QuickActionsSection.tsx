import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import { RefreshSection } from "@/components";
import Stack from "@/components/Stack";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import { useThemeStyles } from "@/theme";

import { useHomepageContent } from "../contexts/HomepageContentContext";
import QuickAction from "./QuickAction";

interface QuickActionsSectionProps {
  onQuickActionPress: (screen: string, stack: keyof AuthenticatedStackParams) => void;
  onRefresh: () => void;
  onEditPress: () => void;
  testID?: string;
  isError: boolean;
}

export default function QuickActionsSection({
  onQuickActionPress,
  onRefresh,
  onEditPress,
  isError,
  testID,
}: QuickActionsSectionProps) {
  const { t } = useTranslation();
  const { quickActions } = useHomepageContent();
  const [shortcutsHeight, setShortcutsHeight] = useState<number>(90);

  const contentContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      top: quickActions.length !== 0 ? -shortcutsHeight / 3 : 0,
      marginBottom: quickActions.length === 0 ? theme.spacing["48p"] : 0,
    }),
    [shortcutsHeight, quickActions.length]
  );

  return (
    <Stack testID={testID} direction="vertical" align="stretch" gap="12p" style={contentContainerStyle}>
      <Stack
        align="stretch"
        direction="horizontal"
        gap="4p"
        justify="space-around"
        style={styles.section}
        onLayout={e => {
          const { height } = e.nativeEvent.layout;
          setShortcutsHeight(Math.floor(height));
        }}>
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
                    testID={testID !== undefined ? `${testID}:QuickAction` : undefined}
                    key={item.Id}
                    color="neutralBase+30"
                    iconName={item["Shortcut Icon"]}
                    backgroundColor="primaryBase-70"
                    onPress={() => onQuickActionPress(item.Link?.screen, item.Link?.stack)}
                    title={item.Name}
                  />
                ) : null
              )}
            <QuickAction
              color="primaryBase-70"
              backgroundColor="neutralBaseHover"
              iconName="edit"
              onPress={onEditPress}
              title="Edit"
            />
          </>
        ) : isError ? (
          <View style={styles.quickActionRefreshSectionView}>
            <RefreshSection
              testID={testID !== undefined ? `${testID}:RefreshSection` : undefined}
              hint={t("Home.DashboardScreen.QuickActionSectionRefreshSectionHint")}
              onRefreshPress={onRefresh}
              hasBorder={true}
            />
          </View>
        ) : null}
      </Stack>
    </Stack>
  );
}

const styles = StyleSheet.create({
  quickActionRefreshSectionView: {
    width: "100%",
  },
  section: {
    position: "absolute",
    zIndex: 1,
  },
});
