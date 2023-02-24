import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import BankCard from "@/components/BankCard";
import useNavigation from "@/navigation/use-navigation";

export default function SingleUseCardsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const navigateToGenerateCard = () => {
    navigation.navigate("SingleUseCards.SingleUseCardInfo");
  };

  return (
    <View style={styles.container}>
      <BankCard.Active
        cardNumber="0238"
        endButton={
          <Pressable>
            <BankCard.EndButton icon={<InfoCircleIcon />} />
          </Pressable>
        }
        label="Standard card"
      />
      <BankCard.Inactive
        label="Standard card"
        endButton={
          <Pressable>
            <BankCard.EndButton icon={<InfoCircleIcon />} />
          </Pressable>
        }
        actionButton={
          <BankCard.ActionButton title={t("SingleUseCard.CardWidget.generateNew")} onPress={navigateToGenerateCard} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    marginTop: "10%",
  },
});
