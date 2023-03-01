import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import BankCard from "@/components/BankCard";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function SingleUseCardsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const navigateToGenerateCard = () => {
    navigation.navigate("CardActions.SingleUseCardInfo");
  };

  const navigateToAboutPage = () => {
    navigation.navigate("CardActions.SingleUseCardAbout");
  };

  const infoIconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.cardInfo);

  return (
    <View style={styles.container}>
      <BankCard.Active
        cardNumber="0238"
        cardType="single-use"
        endButton={
          <Pressable onPress={navigateToAboutPage}>
            <BankCard.EndButton icon={<InfoCircleIcon width={infoIconDimensions} height={infoIconDimensions} />} />
          </Pressable>
        }
        label={t("Cards.singleUseCard")}
      />
      <BankCard.Inactive
        endButton={
          <Pressable onPress={navigateToAboutPage}>
            <BankCard.EndButton icon={<InfoCircleIcon width={infoIconDimensions} height={infoIconDimensions} />} />
          </Pressable>
        }
        actionButton={<BankCard.ActionButton title={t("Cards.generateNew")} onPress={navigateToGenerateCard} />}
        label={t("Cards.singleUseCard")}
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
