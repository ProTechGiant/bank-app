import { useNavigation } from "@react-navigation/native";
import React from "react";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import Page from "@/components/Page";
import Typography from "@/components/Typography";

export default function SendToBeneficiaryScreen() {
  const navigation = useNavigation();

  return (
    <Page backgroundColor="neutralBase-60">
      <ContentContainer isScrollView>
        <Typography.Text>SendToBeneficiaryScreen</Typography.Text>

        {/* TODO: This is a temporary button */}
        <Button
          onPress={() => {
            navigation.navigate("InternalTransfers.InternalTransfersStack", {
              screen: "InternalTransfers.EnterBeneficiaryDetailsScreen",
            });
          }}>
          Enter beneficiary details
        </Button>
      </ContentContainer>
    </Page>
  );
}
