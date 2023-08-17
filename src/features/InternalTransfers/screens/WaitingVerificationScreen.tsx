import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";

import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";

export default function WaitingVerificationScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <Page>
      <ContentContainer>
        <Pressable onPress={() => navigation.navigate("InternalTransfers.ConfirmationScreen")}>
          <FullScreenLoader
            title={t("InternalTransfers.WaitingVerificationScreen.waitingVerification")}
            message={t("InternalTransfers.WaitingVerificationScreen.waitingMessage")}
          />
        </Pressable>
      </ContentContainer>
    </Page>
  );
}
