import { useState } from "react";
import { useTranslation } from "react-i18next";

import InternalTransferTypeModal from "@/components/InternalTransferTypeModal";
import Stack from "@/components/Stack";
import { useInternalTransferContext } from "@/features/InternalTransfers/context/InternalTransfersContext";
import { TransferType } from "@/features/InternalTransfers/types";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { iconMapping } from "@/utils/icon-mapping";

import { useHomepageLayoutOrder } from "../contexts/HomepageLayoutOrderContext";
import QuickAction from "./QuickAction";

interface QuickActionsSectionProps {
  onViewAllPress: () => void;
}

export default function QuickActionsSection({ onViewAllPress }: QuickActionsSectionProps) {
  const { t } = useTranslation("translation", { keyPrefix: "Home.QuickActionSection" });
  const { quickActions } = useHomepageLayoutOrder();
  const navigation = useNavigation();
  const { setInternalTransferEntryPoint, clearContext, setTransferType } = useInternalTransferContext();

  const [isInternalTransferTypeModalVisible, setIsInternalTransferTypeModalVisible] = useState(false);

  const handleOnCroatiaTransferPress = () => {
    setIsInternalTransferTypeModalVisible(false);
    setTransferType(TransferType.InternalTransferAction);
    navigation.navigate("InternalTransfers.InternalTransfersStack", {
      screen: "InternalTransfers.InternalTransferScreen",
    });
  };

  const handleOnAlrajhiTransferPress = () => {
    setIsInternalTransferTypeModalVisible(false);
    setTransferType(TransferType.CroatiaToArbTransferAction);
    navigation.navigate("InternalTransfers.InternalTransfersStack", {
      screen: "InternalTransfers.InternalTransferScreen",
    });
  };

  const handleOnQuickActionPressed = (screen: string, stack: keyof AuthenticatedStackParams) => {
    if (screen === undefined || screen === "") return;
    if (stack === "InternalTransfers.InternalTransfersStack") {
      setInternalTransferEntryPoint("homepage");
      clearContext();
      setIsInternalTransferTypeModalVisible(true);
    } else navigation.navigate(stack, { screen });
  };

  return (
    <>
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
                    onPress={() => handleOnQuickActionPressed(item.Link?.screen, item.Link?.stack)}
                    title={item.Name}
                  />
                ) : null
              )}
            <QuickAction
              key="edit"
              color="complimentBase"
              icon={iconMapping.homepageQuickActions.edit}
              onPress={onViewAllPress}
              title={t("editButton")}
            />
          </>
        ) : null}
      </Stack>
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
