import { RouteProp, useRoute } from "@react-navigation/native";
import { Edge } from "react-native-safe-area-context";

import Page from "@/components/Page";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";

import PickCardTypeScreen from "../ApplyCardScreen/PickCardTypeScreen";

export default function RenewCardScreen() {
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<AuthenticatedStackParams, "CardActions.RenewCardScreen">>();

  const handleOnCancel = () => {
    navigation.goBack();
  };

  const handleOnCardSelect = () => {
    navigation.navigate("CardActions.RenewCardSuccessScreen", {
      cardId: params.cardId,
    });
  };

  return (
    <Page backgroundColor="neutralBase-60" insets={["top", "left", "right"]}>
      <PickCardTypeScreen onCancel={handleOnCancel} onSelected={handleOnCardSelect} variant="renew" />
    </Page>
  );
}
