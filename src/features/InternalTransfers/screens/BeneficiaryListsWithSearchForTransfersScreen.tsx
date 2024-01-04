import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";

import { CloseIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";

import { BeneficiariesListWithSearchForTransfer } from "../components";

export default function BeneficiaryListsWithSearchForTransfersScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        withBackButton={false}
        title={t("InternalTransfers.BeneficiaryListScreen.title")}
        testID="InternalTransfers.BeneficiaryListsWithSearchForTransfersScreen:NavHeader"
        end={
          <Pressable onPress={() => navigation.goBack()}>
            <CloseIcon />
          </Pressable>
        }
      />
      <ContentContainer isScrollView>
        <BeneficiariesListWithSearchForTransfer />
      </ContentContainer>
    </Page>
  );
}
