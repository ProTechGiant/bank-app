import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import { CloseIcon } from "@/assets/icons";
import { Stack } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import { TextInput } from "@/components/Input";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { CheckBoxTermsAndCondition, InformationItem, PortfolioCard, PortfolioHoldingCard } from "../components";
import { mockPortfolioInformation, mockPortfolioList } from "../mocks/mockPortfolio";

export default function SubscriptionScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [selectedPortfolio, setSelectedPortfolio] = useState(0);
  const selectedHoldingPortfolio =
    mockPortfolioList.portfolioList[selectedPortfolio].portfolioHoldingList[0].productInformation.productName;

  const [isDisabled, setIsDisabled] = useState(true);

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
    //TODO - Add logic here whe api ready
  };

  const handleChangePortfolio = (value: number) => {
    setSelectedPortfolio(value);
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
            balance={mockPortfolioList.TotalCashBalance}
            portfolioList={mockPortfolioList.portfolioList}
            handleChangePortfolio={handleChangePortfolio}
          />
          <View style={dropDownStyle}>
            <PortfolioHoldingCard
              selectedPortfolio={selectedPortfolio}
              selectedHoldingPortfolio={selectedHoldingPortfolio}
              portfolioHoldingList={mockPortfolioList.portfolioList[selectedPortfolio].portfolioHoldingList}
            />
          </View>
          <TextInput label={t("MutualFund.SubscriptionScreen.enterAmount")} maxLength={100} />
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
});
