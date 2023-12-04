import { RouteProp, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import { SINGLE_USE_CARD_TYPE } from "@/constants";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import Brand from "../assets/Brand";

export default function DisputeSubmittedScreen() {
  const route = useRoute<RouteProp<AuthenticatedStackParams, "PaymentDisputes.DisputeSubmittedScreen">>();
  const caseType = route.params.caseType;
  const cardType = route.params.cardType;
  const cardStatus = route.params.cardStatus;
  const caseId = route.params.caseId;

  const isCardCancelled = cardStatus === "inactive" || cardStatus === "freeze";

  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleOnOkPress = () => {
    navigation.navigate("PaymentDisputes.MyCasesLandingScreen");
  };

  const textStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  return (
    <Page>
      <ContentContainer isScrollView style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.brandContainerStyle}>
            <Brand />
          </View>
          <View>
            <View style={textStyle}>
              <Typography.Text align="center" weight="bold" size="title1">
                {t("PaymentDisputes.DisputeSubmittedScreen.header")}
              </Typography.Text>
            </View>
            <View style={textStyle}>
              <Typography.Text align="center" size="callout" weight="regular">
                {t("PaymentDisputes.DisputeSubmittedScreen.caseId", { caseId: caseId })}
              </Typography.Text>
            </View>
            <View>
              <View style={textStyle}>
                <Typography.Text align="center" size="footnote" color="neutralBase+10">
                  {t("PaymentDisputes.DisputeSubmittedScreen.textOne")}
                </Typography.Text>
              </View>
              <View style={textStyle}>
                <Typography.Text align="center" size="footnote" color="neutralBase+10">
                  {t("PaymentDisputes.DisputeSubmittedScreen.textTwo")}
                </Typography.Text>
              </View>
              {caseType === "fraud" && cardType !== SINGLE_USE_CARD_TYPE && !isCardCancelled ? (
                <View style={textStyle}>
                  <Typography.Text align="center" size="footnote" color="neutralBase+10">
                    {t("PaymentDisputes.DisputeSubmittedScreen.textThree")}
                  </Typography.Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
        <Button onPress={handleOnOkPress}>{t("PaymentDisputes.DisputeSubmittedScreen.button")}</Button>
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  brandContainerStyle: { marginBottom: "25%" },
  container: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  contentContainer: {
    alignItems: "center",
    marginTop: 150,
  },
});
