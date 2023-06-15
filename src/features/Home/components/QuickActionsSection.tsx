import { useState } from "react";
import { Alert } from "react-native";

import InternalTransferTypeModal from "@/components/InternalTransferTypeModal";
import Stack from "@/components/Stack";
import { useHomepageLayoutOrder } from "@/features/Home/contexts/HomepageLayoutOrderContext";
import { useInternalTransferContext } from "@/features/InternalTransfers/context/InternalTransfersContext";
import { TransferType } from "@/features/InternalTransfers/types";
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
  const { setInternalTransferEntryPoint, clearContext, setTransferType } = useInternalTransferContext();

  const [isInternalTransferTypeModalVisible, setIsInternalTransferTypeModalVisible] = useState(false);

  const handleOnCroatiaTransferPress = () => {
    setIsInternalTransferTypeModalVisible(false);
    setTransferType(TransferType.InternalTransferCroatia);
    navigation.navigate("InternalTransfers.InternalTransfersStack", {
      screen: "InternalTransfers.InternalTransferScreen",
    });
  };

  const handleOnAlrajhiTransferPress = () => {
    setIsInternalTransferTypeModalVisible(false);
    setTransferType(TransferType.InternalTransferAlrajhi);
    // TODO: screens are still under development
    Alert.alert("Under development");
  };

  return (
    <>
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
                    clearContext();
                    setIsInternalTransferTypeModalVisible(true);
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
      {isInternalTransferTypeModalVisible ? (
        <InternalTransferTypeModal
          onClose={() => setIsInternalTransferTypeModalVisible(false)}
          onCroatiaPress={handleOnCroatiaTransferPress}
          onAlrajhiPress={handleOnAlrajhiTransferPress}
        />
      ) : null}
    </>
  );
}
