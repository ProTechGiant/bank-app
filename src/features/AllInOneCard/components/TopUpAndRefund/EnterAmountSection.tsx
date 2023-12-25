import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Dimensions, Pressable, SafeAreaView, TextStyle, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import { AmountInput } from "@/components/Input/AmountInput";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { SwapIcon } from "../../assets/icons";
import { CurrencyConversion } from "../../mocks";
import { Account } from "../../types";
import { AddRefundType } from "../../utils";
import { convertCurrency } from "../../utils/convertCurrency";
import TransferTag from "./TransferTag";

interface EnterAmountSectionProps {
  type: string;
  source: Account;
  destination: Account;
}
export default function EnterAmountSection({ type, source, destination }: EnterAmountSectionProps) {
  const { t } = useTranslation();
  const [sourceCurrency, setSourceCurrency] = useState<string>(source.CurrencyCode);
  const [destinationCurrency, setDestinationCurrency] = useState<string>(destination.CurrencyCode);
  const isAddMoneyMoney: boolean = type === AddRefundType.ADD_MONEY;
  const totalBalance = isAddMoneyMoney ? parseFloat(destination.Balance) : parseFloat(source.Balance);

  const { control, watch, setValue } = useForm({
    mode: "onChange",
    defaultValues: {
      enteredValue: 0,
    },
  });
  const height = Dimensions.get("window").height / 1.7;
  const enteredValue = watch("enteredValue");
  useEffect(() => {
    setSourceCurrency(source.CurrencyCode);
    setDestinationCurrency(destination.CurrencyCode);
    setValue("enteredValue", isAddMoneyMoney ? 0 : Number(totalBalance));
  }, [source.CurrencyCode, destination.CurrencyCode, setValue, isAddMoneyMoney, totalBalance]);

  const handleSwapCurrency = () => {
    const temp = sourceCurrency;
    setSourceCurrency(destinationCurrency);
    setDestinationCurrency(temp);
  };

  const options = [t("AllInOneCard.TopUpAndRefundScreen.full"), t("AllInOneCard.TopUpAndRefundScreen.partially")];
  const [selectedTag, setSelectedTag] = useState(options[0]);

  const handleTagChoosen = (item: string) => {
    setSelectedTag(item);
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["20p"],
  }));

  const errorMessageContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["errorBase-30"],
  }));

  const errorMessageStyle = useThemeStyles<TextStyle>(theme => ({
    padding: theme.spacing["20p"],
  }));
  const marginTopStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));
  const swapSectionStyle = useThemeStyles<TextStyle>(theme => ({
    padding: theme.spacing["20p"],
    borderWidth: 1,
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 8,
  }));
  const navigation = useNavigation();

  const handleOnSubmitPress = () => {
    navigation.navigate("AllInOneCard.AllInOneCardStack", {
      screen: "AllInOneCard.TopUpAndRefundSummaryScreen",
      params: {
        source: source,
        destination: destination,
        amount: enteredValue,
        isAddMoneyMoney: isAddMoneyMoney,
      },
    });
  };
  return (
    <SafeAreaView style={{ height: height }}>
      <Stack direction="vertical" justify="space-between" align="stretch" flex={1}>
        <Stack direction="vertical" align="stretch" justify="space-between" gap="16p">
          <View style={containerStyle}>
            <Typography.Text color="neutralBase+30" size="title1" weight="medium">
              {t("AllInOneCard.TopUpAndRefundScreen.enterAmount")}
            </Typography.Text>
            <View>
              {!isAddMoneyMoney ? (
                <Stack direction="horizontal" gap="8p" style={marginTopStyle}>
                  {options.map((item, index) => {
                    return (
                      <TransferTag
                        key={index}
                        title={item}
                        onPress={() => handleTagChoosen(item)}
                        active={selectedTag === item}
                      />
                    );
                  })}
                </Stack>
              ) : (
                <></>
              )}
              {selectedTag === options[1] || isAddMoneyMoney ? (
                <AmountInput
                  testID="AllInOneCard.TopUpAndRefundScreen:AmountInput"
                  control={control}
                  currentBalance={totalBalance}
                  name="enteredValue"
                  showConvertedBalance={false}
                  AmountType={
                    !isAddMoneyMoney
                      ? sourceCurrency
                      : Number(enteredValue) === 0
                      ? ".00 " + destinationCurrency
                      : destinationCurrency
                  }
                  inputColor="neutralBase+30"
                  hideBalanceError={true}
                />
              ) : (
                <Stack direction="horizontal" gap="8p" align="baseline" style={marginTopStyle}>
                  <Typography.Text color="neutralBase+30" size="xxlarge" weight="medium">
                    {enteredValue.toFixed(2)}
                  </Typography.Text>
                  <Typography.Text color="neutralBase+30" size="large" weight="medium">
                    {isAddMoneyMoney ? destinationCurrency : sourceCurrency}
                  </Typography.Text>
                </Stack>
              )}
            </View>
          </View>
          {enteredValue > Number(source.Balance) ? (
            <View style={errorMessageContainerStyle}>
              <Typography.Text color="errorBase" size="footnote" align="center" style={errorMessageStyle}>
                {t("AllInOneCard.TopUpAndRefundScreen.amountExceedsBalance")}
              </Typography.Text>
            </View>
          ) : (
            <></>
          )}
          {source.CurrencyCode !== "SAR" || destination.CurrencyCode !== "SAR" ? (
            <>
              <Stack direction="horizontal" justify="space-between" style={containerStyle}>
                <View>
                  <Typography.Text color="neutralBase+30" size="footnote">
                    {t("AllInOneCard.TopUpAndRefundScreen.convertedAmount")}
                  </Typography.Text>
                  <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                    {isAddMoneyMoney
                      ? convertCurrency(enteredValue, destinationCurrency, sourceCurrency).toFixed(2)
                      : convertCurrency(enteredValue, sourceCurrency, destinationCurrency).toFixed(2)}{" "}
                    {isAddMoneyMoney ? sourceCurrency : destinationCurrency}
                  </Typography.Text>
                </View>
                <Pressable
                  testID="AllInOneCard.TopUpAndRefundScreen:SwapCurrencyPressable"
                  onPress={handleSwapCurrency}>
                  <Stack direction="horizontal" gap="8p" style={swapSectionStyle}>
                    <SwapIcon />
                    <Typography.Text color="neutralBase+30" size="footnote" weight="medium">
                      {isAddMoneyMoney ? sourceCurrency : destinationCurrency}
                    </Typography.Text>
                  </Stack>
                </Pressable>
              </Stack>
              <Typography.Text color="neutralBase" size="caption1" style={containerStyle}>
                {t("AllInOneCard.TopUpAndRefundScreen.exchangeRate") + " "}{" "}
                {isAddMoneyMoney
                  ? CurrencyConversion[destination.CurrencyCode]
                  : CurrencyConversion[source.CurrencyCode]}
              </Typography.Text>
            </>
          ) : (
            <></>
          )}
        </Stack>
        <View style={containerStyle}>
          <Button
            disabled={enteredValue <= 0 || enteredValue > parseFloat(source.Balance)}
            testID="AllInOneCard.TopUpAndRefundScreen:confirmButton"
            onPress={handleOnSubmitPress}>
            {t("AllInOneCard.TopUpAndRefundScreen.confirmButton")}
          </Button>
        </View>
      </Stack>
    </SafeAreaView>
  );
}
