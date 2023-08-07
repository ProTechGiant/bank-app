import { useTranslation } from "react-i18next";

import Stack from "@/components/Stack";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import { iconMapping } from "@/utils/icon-mapping";

import { useHomepageLayoutOrder } from "../contexts/HomepageLayoutOrderContext";
import QuickAction from "./QuickAction";

interface QuickActionsSectionProps {
  onViewAllPress: () => void;
  onQuickActionPress: (screen: string, stack: keyof AuthenticatedStackParams) => void;
}

export default function QuickActionsSection({ onViewAllPress, onQuickActionPress }: QuickActionsSectionProps) {
  const { t } = useTranslation();
  const { quickActions } = useHomepageLayoutOrder();

  return (
    <Stack align="stretch" direction="horizontal" justify="space-between">
      {quickActions !== undefined ? (
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
                  color="complimentBase"
                  image={item["Shortcut Icon"]}
                  onPress={() => onQuickActionPress(item.Link?.screen, item.Link?.stack)}
                  title={item.Name}
                />
              ) : null
            )}
          <QuickAction
            key="edit"
            color="complimentBase"
            icon={iconMapping.homepageQuickActions.edit}
            onPress={onViewAllPress}
            title={t("Home.QuickActionSection.editButton")}
          />
        </>
      ) : null}
    </Stack>
  );
}
