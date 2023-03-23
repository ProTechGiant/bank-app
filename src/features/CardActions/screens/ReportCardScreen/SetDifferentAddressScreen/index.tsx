import { RouteProp, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { SafeAreaProvider } from "react-native-safe-area-context";

import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import TemporaryAddress from "@/components/TemporaryAddress";
import { CardActionsStackParams } from "@/features/CardActions/CardActionsStack";
import useNavigation from "@/navigation/use-navigation";
import { Address } from "@/types/Address";

export default function SetDifferentAddressScreen() {
  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.SetDifferentAddressScreen">>();

  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleOnSubmit = (values: Address) => {
    navigation.navigate("CardActions.ReportCardScreen", { alternativeAddress: values });
  };

  return (
    <SafeAreaProvider>
      <Page>
        <NavHeader
          title={t("ApplyCards.SetTemporaryAddressScreen.navTitle")}
          withBackButton={false}
          end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}
        />
        <TemporaryAddress onSubmit={handleOnSubmit} address={route.params.alternativeAddress} />
      </Page>
    </SafeAreaProvider>
  );
}
