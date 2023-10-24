import { yupResolver } from "@hookform/resolvers/yup";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";
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
import { useGetCustomerPortfolios } from "../hooks/query-hooks";
import { MutualFundStackParams } from "../MutualFundStack";

interface SubscriptionAmount {
  Amount: number;
}

interface SubscriptionAmount {
  Amount: number;
}

export default function SubscriptionScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<MutualFundStackParams, "MutualFund.Subscription">>();
  const productInformation = params.ProductKeyInformation;
  const { data: customerPortfolioList, isLoading } = useGetCustomerPortfolios();
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(
    customerPortfolioList ? customerPortfolioList.PortfolioList[0].PortfolioId : ""
  );
  const [selectedHoldingPortfolioId, setSelectedHoldingPortfolioId] = useState(
    customerPortfolioList
      ? customerPortfolioList.PortfolioList[0].PortfolioHoldingList[0].ProductInformation.ProductId
      : ""
  );
  const selectedPortfolio = customerPortfolioList?.PortfolioList.find(
    portfolio => portfolio.PortfolioId === selectedPortfolioId
  );
  const [isDisabled, setIsDisabled] = useState(true);
  const [firstPortfolioName, setFirstPortfolioName] = useState(
    customerPortfolioList ? customerPortfolioList.PortfolioList[0].PortfolioName : ""
  );
  const [secondPortfolioName, setSecondPortfolioName] = useState(
    customerPortfolioList
      ? customerPortfolioList.PortfolioList[0].PortfolioHoldingList[0].ProductInformation.ProductName
      : ""
  );
  const { width } = useWindowDimensions();

  useEffect(() => {
    setSelectedHoldingPortfolioId(
      selectedPortfolio?.PortfolioHoldingList && selectedPortfolio?.PortfolioHoldingList.length > 0
        ? selectedPortfolio.PortfolioHoldingList[0].ProductInformation.ProductId
        : ""
    );
    setFirstPortfolioName(selectedPortfolio ? selectedPortfolio.PortfolioName : "");
    setSecondPortfolioName(
      selectedPortfolio?.PortfolioHoldingList && selectedPortfolio?.PortfolioHoldingList.length > 0
        ? selectedPortfolio.PortfolioHoldingList[0].ProductInformation.ProductName
        : ""
    );
  }, [selectedPortfolioId]);

  useEffect(() => {
    setSelectedPortfolioId(customerPortfolioList ? customerPortfolioList.PortfolioList[0].PortfolioId : "");
    setSelectedHoldingPortfolioId(
      customerPortfolioList
        ? customerPortfolioList.PortfolioList[0].PortfolioHoldingList[0].ProductInformation.ProductId
        : ""
    );
    setFirstPortfolioName(customerPortfolioList ? customerPortfolioList.PortfolioList[0].PortfolioName : "");
    setSecondPortfolioName(
      customerPortfolioList
        ? customerPortfolioList.PortfolioList[0].PortfolioHoldingList[0].ProductInformation.ProductName
        : ""
    );
  }, [customerPortfolioList]);

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

  const handlePortfolioChange = (value: string | number) => {
    setSelectedPortfolioId(value);
  };

  const handleHoldingPortfolioChange = (value: string | number) => {
    setSelectedHoldingPortfolioId(value);
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

  const loadingContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      borderRadius: theme.radii.small,
      height: width - theme.spacing["64p"],
      width: width - theme.spacing["64p"],
      justifyContent: "center",
    }),
    [width]
  );
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

      {isLoading ? (
        <View style={loadingContainerStyle}>
          <ActivityIndicator />
        </View>
      ) : (
        <ContentContainer isScrollView>
          <Typography.Text color="neutralBase+30" size="title1" weight="medium">
            {productInformation.mutualFundName}
          </Typography.Text>
          <View style={accountSectionStyle}>
            <PortfolioCard
              portfolioId={selectedPortfolioId}
              balance={customerPortfolioList ? customerPortfolioList.TotalCashBalance : 0}
              portfolioList={customerPortfolioList ? customerPortfolioList.PortfolioList : []}
              onPortfolioChange={handlePortfolioChange}
            />
            <View style={dropDownStyle}>
              <PortfolioHoldingCard
                selectedHoldingPortfolioId={selectedHoldingPortfolioId}
                portfolioHoldingList={selectedPortfolio ? selectedPortfolio.PortfolioHoldingList : []}
                onHoldingPortfolioChange={handleHoldingPortfolioChange}
              />
            </View>
            {firstPortfolioName === secondPortfolioName ? (
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
              value={productInformation.riskLevel}
            />
            <InformationItem
              label={t("MutualFund.SubscriptionScreen.informationItem.inceptionDate")}
              value={productInformation.inceptionDate}
            />
            <InformationItem
              label={t("MutualFund.SubscriptionScreen.informationItem.fundCurrency")}
              value={productInformation.fundCurrency}
            />
            <InformationItem
              label={t("MutualFund.SubscriptionScreen.informationItem.performanceFee")}
              value={productInformation.performanceFee}
            />
            <InformationItem
              label={t("MutualFund.SubscriptionScreen.informationItem.minimumSubscription")}
              value={`${productInformation.minimumSubscription} ${t("MutualFund.SubscriptionScreen.currency")}`}
            />
            <InformationItem
              label={t("MutualFund.SubscriptionScreen.informationItem.minimumAdditionalSubscription")}
              value={`${productInformation.minimumAdditionalSubscription} ${t(
                "MutualFund.SubscriptionScreen.currency"
              )}`}
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
      )}
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
