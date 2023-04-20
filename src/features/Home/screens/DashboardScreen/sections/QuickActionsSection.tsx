import Stack from "@/components/Stack";
import { useHomepageLayoutOrder } from "@/features/Home/contexts/HomepageLayoutOrderContext";
import { useInternalTransferContext } from "@/features/InternalTransfers/context/InternalTransfersContext";
import useNavigation from "@/navigation/use-navigation";
import { iconMapping } from "@/utils/icon-mapping";

import QuickAction from "./QuickAction";
import Section from "./Section";

interface QuickActionsSectionProps {
  onViewAllPress: () => void;
}

export default function QuickActionsSection({ onViewAllPress }: QuickActionsSectionProps) {
  const { quickActions } = useHomepageLayoutOrder();
  const navigation = useNavigation();
  const { setInternalTransferEntryPoint } = useInternalTransferContext();

  return (
    <Section title="Shortcuts" onViewAllPress={onViewAllPress}>
      <Stack align="stretch" direction="horizontal" justify="space-between">
        {quickActions !== undefined
          ? quickActions.slice(0, 3).map(element => {
              const handleOnPress = () => {
                if (element.type === "settings") navigation.navigate("Settings.SettingsScreen");
                if (element.type === "referrals") navigation.navigate("Referral.ReferralStack");
                if (element.type === "balance-add")
                  navigation.navigate("AddMoney.AddMoneyStack", { screen: "AddMoney.AddMoneyInfoScreen" });
                if (element.type === "internal-transfer") {
                  setInternalTransferEntryPoint("homepage");
                  navigation.navigate("InternalTransfers.InternalTransfersStack", {
                    screen: "InternalTransfers.InternalTransferScreen",
                  });
                }
              };
              return (
                <QuickAction
                  key={element.type}
                  color="primaryBase-30"
                  icon={iconMapping.homepageQuickActions[element?.type]}
                  onPress={handleOnPress}
                  title={element.name}
                />
              );
            })
          : null}
      </Stack>
    </Section>
  );
}
