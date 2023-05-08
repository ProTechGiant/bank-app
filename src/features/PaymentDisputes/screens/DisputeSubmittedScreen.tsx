import { RouteProp, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import { SINGLE_USE_CARD_TYPE } from "@/constants";
import MainStackParams from "@/navigation/mainStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function DisputeSubmittedScreen() {
  const route = useRoute<RouteProp<MainStackParams, "PaymentDisputes.DisputeSubmittedScreen">>();
  const caseType = route.params.caseType;
  const cardType = route.params.cardType;
  const caseId = route.params.caseId;

  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleOnOkPress = () => {
    //TODO: navigate to Cases landing screen
    navigation.navigate("Temporary.LandingScreen");
  };

  const brandContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.complimentBase,
    height: 45,
    width: 150,
    borderRadius: theme.radii.xxlarge,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "25%",
  }));

  const textStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  return (
    <Page>
      <ContentContainer isScrollView style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={brandContainerStyle}>
            <Typography.Text size="callout" weight="medium" color="neutralBase-60">
              {t("PaymentDisputes.DisputeSubmittedScreen.brandMoment")}
            </Typography.Text>
          </View>
          <View>
            <View style={textStyle}>
              <Typography.Text align="center" weight="medium" size="title1">
                {t("PaymentDisputes.DisputeSubmittedScreen.header")}
              </Typography.Text>
            </View>
            <View style={textStyle}>
              <Typography.Text align="center">
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
              {/* TODO: add a check for cardStatus */}
              {caseType === "fraud" && cardType !== SINGLE_USE_CARD_TYPE ? (
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
  container: {
    justifyContent: "space-between",
  },
  contentContainer: {
    alignItems: "center",
    marginTop: 150,
  },
});
