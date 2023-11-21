import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { Modal, ProgressIndicator, Stack, Typography } from "@/components";
import Button from "@/components/Button";
import { CheckboxInput } from "@/components/Input";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { RadioButton, RadioButtonGroup } from "@/components/RadioButton";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { DropDownFieldContainer } from "../components";
const NUMBER_OF_FIELDS_IN_PAGE = 4;
interface FieldsType {
  title: string;
  values: string[];
}

export default function MutualFundPending() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const fields: FieldsType[] = [
    {
      title: t("GoalGetter.MutualFundPendingScreen.investmentGoal"),
      values: ["Growth", "Saving"],
    },
    {
      title: t("GoalGetter.MutualFundPendingScreen.expectedCashOut"),
      values: ["Short Term ( less than 1 year )", "Mid Term ( less than 3 years )", "Long Term ( more than 3 years )"],
    },
    {
      title: t("GoalGetter.MutualFundPendingScreen.netWealth"),
      values: ["25,000.00 SAR or less", "250,000.00 SAR or less", "250,000.00 SAR or more"],
    },
    {
      title: t("GoalGetter.MutualFundPendingScreen.investmentExperienceLevel"),
      values: ["Low", "Intermediate", "expert"],
    },
    {
      title: t("GoalGetter.MutualFundPendingScreen.educationLevel"),
      values: ["Primary", "Secondary", "Bachelor's", "Masters"],
    },
    {
      title: t("GoalGetter.MutualFundPendingScreen.investmentPortfolio"),
      values: ["Money Market only"],
    },
    {
      title: t("GoalGetter.MutualFundPendingScreen.investmentExperienceYears"),
      values: ["Zero - Three years", "Three - Five years", "Five - Ten years", "More than Ten years"],
    },
    {
      title: t("GoalGetter.MutualFundPendingScreen.riskProfile"),
      values: ["Low", "Medium", "High"],
    },
    {
      title: t("GoalGetter.MutualFundPendingScreen.annualIncome"),
      values: [
        "less 100,000.00 SAR",
        "less 300,000.00 SAR",
        "less 500,000.00 SAR",
        "less 1,000,000.00 SAR",
        "more 1,000,000.00 SAR",
      ],
    },
    {
      title: t("GoalGetter.MutualFundPendingScreen.transactionAssetsPercentage"),
      values: ["0% - 25%", "25% - 75%", "75% - 100%"],
    },
    {
      title: t("GoalGetter.MutualFundPendingScreen.volumeOfTransactions"),
      values: ["0 - 5 transaction", "5 - 15 transaction", "15 - 30 transaction", "more than 30 transactions"],
    },
  ];
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFieldModalVisible, setIsFieldModalVisible] = useState<boolean>(false);
  const [selectedField, setSelectedField] = useState<number>(0);
  const [isTermsAndConditionsAgreed, setIsTermsAndConditionsAgreed] = useState<boolean>(false);
  const [currentValues, setCurrentValues] = useState<string[]>([...fields.map(v => v.values[0])]);

  const isLastPage = currentPage * NUMBER_OF_FIELDS_IN_PAGE >= fields.length;
  const isContinueButtonDisabled = !((isLastPage && isTermsAndConditionsAgreed) || !isLastPage);

  const handleOnFieldOnPress = (index: number) => {
    setIsFieldModalVisible(true);
    setSelectedField(index);
  };
  const handleOnGoBackPress = () => {
    if (currentPage === 1) {
      navigation.goBack();
    } else {
      setCurrentPage(c => c - 1);
    }
  };
  const handleOnContinueButtonPress = () => {
    if (!isLastPage) {
      setCurrentPage(s => s + 1);
    } else {
      //TODO go to otp
    }
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
    justifyContent: "space-between",
    flex: 1,
  }));
  const dropDownsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    marginTop: theme.spacing["20p"],
    width: "100%",
  }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <NavHeader onBackPress={handleOnGoBackPress} title={t("GoalGetter.MutualFundPendingScreen.title")}>
        <View style={styles.progressIndicator}>
          <ProgressIndicator currentStep={currentPage} totalStep={fields.length / NUMBER_OF_FIELDS_IN_PAGE + 1} />
        </View>
      </NavHeader>
      <View style={containerStyle}>
        <Stack direction="vertical" gap="24p" style={dropDownsContainerStyle}>
          <Typography.Text size="title1" weight="bold">
            {t("GoalGetter.MutualFundPendingScreen.yourIncomeDetails")}
          </Typography.Text>
          {fields
            .slice((currentPage - 1) * NUMBER_OF_FIELDS_IN_PAGE, currentPage * NUMBER_OF_FIELDS_IN_PAGE)
            .map((field, index) => (
              <DropDownFieldContainer
                title={field.title}
                value={currentValues[index + (currentPage - 1) * NUMBER_OF_FIELDS_IN_PAGE]}
                onPress={() => handleOnFieldOnPress(index + (currentPage - 1) * NUMBER_OF_FIELDS_IN_PAGE)}
              />
            ))}
        </Stack>
        <Stack direction="vertical" justify="center" align="center" gap="16p">
          {isLastPage ? (
            <Stack direction="horizontal">
              <CheckboxInput
                value={isTermsAndConditionsAgreed}
                onChange={() => setIsTermsAndConditionsAgreed(a => !a)}
              />
              <Typography.Text>{t("GoalGetter.MutualFundPendingScreen.yourIncomeDetails")} </Typography.Text>
              {/* //TODO change productId to the correct one from BE   */}
              <Pressable onPress={() => navigation.navigate("GoalGetter.TermsAndConditionsScreen", { productId: "3" })}>
                <Typography.Text color="successBase" style={styles.underlineText}>
                  {t("GoalGetter.MutualFundPendingScreen.termsAndConditions")}
                </Typography.Text>
              </Pressable>
            </Stack>
          ) : null}
          <Button onPress={handleOnContinueButtonPress} disabled={isContinueButtonDisabled} block={true}>
            <Typography.Text color={isContinueButtonDisabled ? "neutralBase-20" : "neutralBase-60"}>
              {t("GoalGetter.MutualFundPendingScreen.continue")}
            </Typography.Text>
          </Button>
        </Stack>
      </View>
      <Modal visible={isFieldModalVisible} onClose={() => setIsFieldModalVisible(false)}>
        <RadioButtonGroup
          value={currentValues[selectedField]}
          onPress={(value: string) =>
            setCurrentValues(v => {
              v[selectedField] = value;
              return [...v];
            })
          }>
          {fields[selectedField].values.map(value => (
            <RadioButton label={value} value={value} />
          ))}
        </RadioButtonGroup>
      </Modal>
    </Page>
  );
}

const styles = StyleSheet.create({
  progressIndicator: {
    alignSelf: "center",
    width: "70%",
  },
  underlineText: {
    textDecorationLine: "underline",
  },
});
