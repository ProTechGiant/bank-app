import { createElement } from "react";

import * as icons from "@/assets/icons";
import Stack from "@/components/Stack";
import { useLayout } from "@/features/Home/contexts/LayoutContext";
import useNavigation from "@/navigation/use-navigation";

import QuickAction from "./QuickAction";
import Section from "./Section";

interface QuickActionsSectionProps {
  onViewAllPress: () => void;
}

export default function QuickActionsSection({ onViewAllPress }: QuickActionsSectionProps) {
  const { quickActions } = useLayout();
  const navigation = useNavigation();

  return (
    <Section title="Shortcuts" onViewAllPress={onViewAllPress}>
      <Stack align="stretch" direction="horizontal" justify="space-between">
        {quickActions.slice(0, 3).map(element => {
          const handleOnPress = () => {
            if (element.type === "settings") navigation.navigate("Settings.SettingsScreen");
            if (element.type === "referrals") navigation.navigate("Referral.HubScreen");
            if (element.type === "balance-add")
              navigation.navigate("AddMoney.AddMoneyStack", { screen: "AddMoney.AddMoneyInfoScreen" });
            if (element.type === "internal-transfer")
              navigation.navigate("InternalTransfers.InternalTransfersStack", {
                screen: "InternalTransfers.InternalTransferScreen",
              });
          };

          return (
            <QuickAction
              key={element.type}
              color={element.color}
              icon={createElement(icons[element.icon])}
              onPress={handleOnPress}
              title={element.title}
            />
          );
        })}
      </Stack>
    </Section>
  );
}
