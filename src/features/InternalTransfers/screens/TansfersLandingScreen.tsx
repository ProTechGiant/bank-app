import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, ScrollView, ViewStyle } from "react-native";

import { TransferSettingsIcon } from "@/assets/icons";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import SelectTransferTypeModal from "@/components/SelectTransferTypeModal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { TransferType } from "@/types/InternalTransfer";

import { FrequentBeneficiaries, TransactionCell, TransferActionButtons, TransferServices } from "../components";
import { useFavouriteBeneficiaries } from "../hooks/query-hooks";
import { recentTransactions } from "../mock";
import { BeneficiaryType } from "../types";

export default function TansfersLandingScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { setTransferType } = useInternalTransferContext();

  const { data: favouriteBeneficiaries } = useFavouriteBeneficiaries();

  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [isSelectTransferTypeVisible, setIsSelectTransferTypeVisible] = useState(false);

  const handleOnCroatiaTransferPress = () => {
    setTransferType(TransferType.InternalTransferAction);
    navigation.navigate("InternalTransfers.InternalTransfersStack", {
      screen: "InternalTransfers.InternalTransferScreen",
    });
  };

  const handleOnAlrajhiTransferPress = () => {
    setTransferType(TransferType.CroatiaToArbTransferAction);
    navigation.navigate("InternalTransfers.InternalTransfersStack", {
      screen: "InternalTransfers.InternalTransferScreen",
    });
  };

  const handleOnLocalTransferPress = () => {
    navigation.navigate("InternalTransfers.InternalTransfersStack", {
      screen: "InternalTransfers.QuickTransferScreen",
    });
  };

  const handleNavigateToSettings = () => {
    navigation.navigate("InternalTransfers.InternalTransfersStack", {
      screen: "InternalTransfers.TransferSettingScreen",
    });
  };

  const handleOnBeneficiaryPress = (beneficiary: BeneficiaryType) => {
    navigation.navigate("InternalTransfers.BeneficiaryProfileScreen", {
      Beneficiary: {
        FullName: beneficiary.Name,
        BankName: beneficiary.BankName,
        IBAN: beneficiary.IBAN,
        beneficiaryId: beneficiary.BeneficiaryId,
        nickname: beneficiary.beneficiaryNickname,
        active: beneficiary.IVRValidated,
        type: beneficiary.BeneficiaryType,
      },
    });
  };
  const handleOnAddNewBeneficiaryPress = () => {
    setIsSelectTransferTypeVisible(true);
  };

  const handleOnCroatiaBeneficiaryPress = () => {
    setIsSelectTransferTypeVisible(false);
    setTransferType(TransferType.InternalTransferAction);
    navigation.navigate("InternalTransfers.EnterBeneficiaryDetailsScreen");
  };

  const handleOnAlrajhiBeneficiaryPress = () => {
    setIsSelectTransferTypeVisible(false);
    setTransferType(TransferType.CroatiaToArbTransferAction);
    navigation.navigate("InternalTransfers.EnterBeneficiaryDetailsScreen");
  };

  const handleOnLocalBeneficiaryPress = () => {
    setIsSelectTransferTypeVisible(false);
    //TODO: handle local beneficiary
  };

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["20p"],
  }));
  const NavHeaderColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);
  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom"]}>
      <NavHeader
        variant="angled"
        backgroundAngledColor={NavHeaderColor}
        testID="InternalTransfers.TransfersLandingScreen:NavHeader"
        end={
          <Pressable onPress={handleNavigateToSettings} testID="AllInOneCard.CardControlScreen:Set">
            <TransferSettingsIcon />
          </Pressable>
        }>
        <NavHeader.BoldTitle color="neutralBase-60">
          {t("InternalTransfers.TransfersLandingScreen.title")}
        </NavHeader.BoldTitle>
      </NavHeader>
      <ScrollView contentContainerStyle={contentStyle}>
        <Stack direction="vertical" gap="32p" align="stretch">
          {/** Transfer quick actions */}
          <TransferActionButtons
            onCroToCroPress={handleOnCroatiaTransferPress}
            onToARBPress={handleOnAlrajhiTransferPress}
            onLocalTransferPress={handleOnLocalTransferPress}
          />

          <TransferServices />

          <FrequentBeneficiaries
            beneficiaries={favouriteBeneficiaries ? favouriteBeneficiaries.Beneficiary : []}
            onPress={handleOnBeneficiaryPress}
            onAddNewBeneficiary={handleOnAddNewBeneficiaryPress}
          />

          <Stack direction="vertical" align="stretch" gap="12p">
            <Stack direction="horizontal" align="center" justify="space-between">
              <Typography.Text size="title3" weight="medium">
                {t("InternalTransfers.TransfersLandingScreen.Transactions.title")}
              </Typography.Text>
              <Typography.Text size="footnote" weight="regular" color="neutralBase+20">
                {t("InternalTransfers.TransfersLandingScreen.viewAll")}
              </Typography.Text>
            </Stack>
            {recentTransactions.length ? (
              <FlatList
                data={recentTransactions?.slice(0, 4)}
                renderItem={({ item }) => (
                  <TransactionCell
                    transaction={item}
                    onPress={() => {
                      return;
                    }}
                  />
                )}
                keyExtractor={(_item, index) => `key ${index}`}
                showsVerticalScrollIndicator={false}
              />
            ) : null}
          </Stack>
        </Stack>
      </ScrollView>
      <SelectTransferTypeModal
        isVisible={isSelectTransferTypeVisible}
        onCroatiaPress={handleOnCroatiaBeneficiaryPress}
        onAlrajhiPress={handleOnAlrajhiBeneficiaryPress}
        onLocalTransferPress={handleOnLocalBeneficiaryPress}
        onClose={() => setIsSelectTransferTypeVisible(false)}
        testID="InternalTransfers.TransfersLandingScreen:SelectTransferTypeModal"
      />
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isErrorModalVisible}
        onClose={() => setIsErrorModalVisible(false)}
      />
    </Page>
  );
}
