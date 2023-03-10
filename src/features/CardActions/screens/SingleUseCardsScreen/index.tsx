import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import BankCard from "@/components/BankCard";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";

import useCards from "../../hooks/use-cards";
import useCustomerTier from "../../hooks/use-customer-tier";
import { mockCard } from "../../mocks/mockCard";

export default function SingleUseCardsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const tier = useCustomerTier();

  const cards = useCards();

  let singleUseCard = mockCard;

  const navigateToGenerateCard = () => {
    navigation.navigate("CardActions.SingleUseCardInfo");
  };

  const navigateToAboutPage = () => {
    navigation.navigate("CardActions.SingleUseCardAbout");
  };

  const checkIfUserHasActiveSUC = () => {
    let hasSUC = false;
    if (cards.data != null && cards.data.length > 0) {
      cards.data.map(card => {
        if (card.CardType === "3") {
          singleUseCard = card;
          return (hasSUC = true);
        }
      });
    }
    return hasSUC;
  };

  return (
    <View style={styles.container}>
      {tier.data?.tier === "Plus" ? (
        <View>
          {checkIfUserHasActiveSUC() ? (
            <BankCard.Active
              cardNumber={singleUseCard.LastFourDigits}
              cardType="single-use"
              endButton={
                <Pressable onPress={navigateToAboutPage}>
                  <BankCard.EndButton icon={<InfoCircleIcon />} />
                </Pressable>
              }
              label={t("Cards.singleUseCard")}
            />
          ) : (
            <BankCard.Inactive
              type="inactive"
              endButton={
                <Pressable onPress={navigateToAboutPage}>
                  <BankCard.EndButton icon={<InfoCircleIcon />} />
                </Pressable>
              }
              actionButton={
                <BankCard.ActionButton title={t("Cards.generateNew")} type="light" onPress={navigateToGenerateCard} />
              }
              label={t("Cards.singleUseCard")}
            />
          )}
        </View>
      ) : (
        <Typography.Text color="primaryBase" size="title1" weight="semiBold">
          No SUCs allowed
        </Typography.Text>
      )}
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
