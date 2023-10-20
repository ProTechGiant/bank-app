import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";
import * as yup from "yup";

import { CloseIcon } from "@/assets/icons";
import { Stack } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import TextInput from "@/components/Form/TextInput";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { CheckBoxTermsAndCondition, InformationItem, PortfolioCard, PortfolioHoldingCard } from "../components";
import { mockPortfolioInformation, mockPortfolioList } from "../mocks/mockPortfolio";

interface SubscriptionAmount {
  Amount: number;
}

export default function SubscriptionScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [selectedPortfolioName, setSelectedPortfolioName] = useState(mockPortfolioList.portfolioList[0].portfolioName);
  const [selectedHoldingPortfolioName, setSelectedHoldingPortfolioName] = useState(
    mockPortfolioList.portfolioList[0].portfolioHoldingList[0].productInformation.productName
  );
  const selectedPortfolio = mockPortfolioList.portfolioList.find(
    portfolio => portfolio.portfolioName === selectedPortfolioName
  );
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    setSelectedHoldingPortfolioName(
      selectedPortfolio?.portfolioHoldingList && selectedPortfolio?.portfolioHoldingList.length > 0
        ? selectedPortfolio.portfolioHoldingList[0].productInformation.productName
        : ""
    );
  }, [selectedPortfolioName]);

  const validationSchema = yup.object().shape({
    Amount: yup.number().required("Enter Amount").typeError("Enter a valid number"),
  });

  const { control } = useForm<SubscriptionAmount>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {},
  });
  const handleOnCheckboxPress = () => {
    setIsDisabled(value => !value);
  };

  const handleOnPressTermsAndConditions = () => {
    navigation.navigate("MutualFund.TermsAndConditions");
  };

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  const handleOnClosePress = () => {
    //TODO - Add navigation here
  };

  const handleOnConfirmPress = () => {
    navigation.navigate("MutualFund.MutualFundOrderSummaryScreen");
  };

  const handlePortfolioChange = (value: string) => {
    setSelectedPortfolioName(value);
  };

  const handleHoldingPortfolioChange = (value: string) => {
    setSelectedHoldingPortfolioName(value);
  };

  const accountSectionStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["24p"],
  }));

  const dropDownStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
  }));

  const keyInformationStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  const noteStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
    padding: theme.spacing["16p"],
    borderRadius: theme.radii.small,
    borderLeftWidth: theme.spacing["4p"],
    borderLeftColor: theme.palette["primaryBase-40"],
    backgroundColor: theme.palette["supportBase-20"],
  }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <NavHeader
        title={t("MutualFund.SubscriptionScreen.title")}
        onBackPress={handleOnBackPress}
        end={
          <NavHeader.IconEndButton
            icon={<NavHeader.IconEndButton icon={<CloseIcon />} onPress={handleOnClosePress} />}
            onPress={handleOnClosePress}
          />
        }
      />
      <ContentContainer isScrollView>
        <Typography.Text color="neutralBase+30" size="title1" weight="medium">
          {mockPortfolioInformation.mutualFundName}
        </Typography.Text>
        <View style={accountSectionStyle}>
          <PortfolioCard
            portfolioName={selectedPortfolioName}
            balance={mockPortfolioList.TotalCashBalance}
            portfolioList={mockPortfolioList.portfolioList}
            handlePortfolioChange={handlePortfolioChange}
          />
          <View style={dropDownStyle}>
            <PortfolioHoldingCard
              selectedHoldingPortfolioName={selectedHoldingPortfolioName}
              portfolioHoldingList={selectedPortfolio ? selectedPortfolio.portfolioHoldingList : []}
              handleHoldingPortfolioChange={handleHoldingPortfolioChange}
            />
          </View>
          {selectedHoldingPortfolioName === selectedPortfolioName ? (
            <View style={noteStyle}>
              <Typography.Text size="footnote" weight="medium" style={styles.textNoteStyle}>
                {t("MutualFund.SubscriptionScreen.note")}
              </Typography.Text>
            </View>
          ) : null}
          <TextInput
            control={control}
            keyboardType="number-pad"
            name="Amount"
            label={t("MutualFund.SubscriptionScreen.enterAmount")}
          />
        </View>
        <Typography.Text color="neutralBase+30" size="title3" weight="medium" style={keyInformationStyle}>
          {t("MutualFund.SubscriptionScreen.keyInformation")}
        </Typography.Text>
        <View style={styles.informationContainerStyle}>
          <InformationItem
            label={t("MutualFund.SubscriptionScreen.informationItem.riskLevel")}
            value={mockPortfolioInformation.riskLevel}
          />
          <InformationItem
            label={t("MutualFund.SubscriptionScreen.informationItem.inceptionDate")}
            value={mockPortfolioInformation.inceptionDate}
          />
          <InformationItem
            label={t("MutualFund.SubscriptionScreen.informationItem.fundCurrency")}
            value={mockPortfolioInformation.fundCurrency}
          />
          <InformationItem
            label={t("MutualFund.SubscriptionScreen.informationItem.performanceFee")}
            value={mockPortfolioInformation.performanceFee}
          />
          <InformationItem
            label={t("MutualFund.SubscriptionScreen.informationItem.minimumSubscription")}
            value={mockPortfolioInformation.minimumSubscription}
          />
          <InformationItem
            label={t("MutualFund.SubscriptionScreen.informationItem.minimumAdditionalSubscription")}
            value={mockPortfolioInformation.minimumAdditionalSubscription}
          />
        </View>
        <Stack gap="16p" direction="vertical" align="stretch">
          <CheckBoxTermsAndCondition
            caption={t("MutualFund.SubscriptionScreen.termsAndConditionsText")}
            link={t("MutualFund.SubscriptionScreen.termsAndConditionsLink")}
            onCheckBoxPress={handleOnCheckboxPress}
            isChecked={!isDisabled}
            onPress={handleOnPressTermsAndConditions}
          />
          <Button disabled={isDisabled} onPress={handleOnConfirmPress}>
            {t("MutualFund.SubscriptionScreen.subscribeButton")}
          </Button>
        </Stack>
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  informationContainerStyle: {
    marginBottom: 94,
  },
  textNoteStyle: {
    color: "#593B14",
  },
});
