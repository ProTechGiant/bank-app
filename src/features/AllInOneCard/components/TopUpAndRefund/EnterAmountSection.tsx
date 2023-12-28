import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Dimensions, Pressable, SafeAreaView, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

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
  const isAddMoney: boolean = type === AddRefundType.ADD_MONEY;
  const options = [t("AllInOneCard.TopUpAndRefundScreen.full"), t("AllInOneCard.TopUpAndRefundScreen.partially")];
  const [selectedTag, setSelectedTag] = useState(options[0]);

  const totalBalance = isAddMoney
    ? source.CurrencyCode === sourceCurrency
      ? convertCurrency(Number(source.Balance), sourceCurrency, destinationCurrency)
      : parseFloat(source.Balance)
    : source.CurrencyCode === sourceCurrency
    ? parseFloat(source.Balance)
    : convertCurrency(Number(source.Balance), destinationCurrency, sourceCurrency);

  const { control, watch, setValue } = useForm({
    mode: "onChange",
    defaultValues: {
      enteredValue: 0,
    },
  });
  const height = Dimensions.get("window").height / 1.8;
  const enteredValue = watch("enteredValue");

  useEffect(() => {
    setSourceCurrency(source.CurrencyCode);
    setDestinationCurrency(destination.CurrencyCode);
    if (!isAddMoney && selectedTag === options[0]) {
      setValue("enteredValue", totalBalance);
    } else {
      setValue("enteredValue", 0);
    }
  }, [source.CurrencyCode, destination.CurrencyCode, setValue, isAddMoney, selectedTag]);

  const handleSwapCurrency = () => {
    const temp = sourceCurrency;
    setSourceCurrency(destinationCurrency);
    setDestinationCurrency(temp);
  };

  const handleTagChoosen = (item: string) => {
    setSelectedTag(item);
  };

  const navigation = useNavigation();

  const handleOnSubmitPress = () => {
    let amount;
    if (!isAddMoney && selectedTag === options[0]) {
      amount =
        source.CurrencyCode === sourceCurrency
          ? totalBalance
          : convertCurrency(totalBalance, destination.CurrencyCode, source.CurrencyCode);
    } else
      amount = isAddMoney
        ? source.CurrencyCode === sourceCurrency
          ? convertCurrency(Number(enteredValue), destination.CurrencyCode, source.CurrencyCode)
          : enteredValue
        : source.CurrencyCode === sourceCurrency
        ? enteredValue
        : convertCurrency(Number(enteredValue), destination.CurrencyCode, source.CurrencyCode);

    navigation.navigate("AllInOneCard.AllInOneCardStack", {
      screen: "AllInOneCard.TopUpAndRefundSummaryScreen",
      params: {
        source: source,
        destination: destination,
        amount: amount,
        isAddMoney: isAddMoney,
      },
    });
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

  return (
    <SafeAreaView style={{ height: height }}>
      <Stack direction="vertical" justify="space-between" align="stretch" flex={1}>
        <Stack direction="vertical" align="stretch" justify="space-between" gap="16p">
          <View style={containerStyle}>
            <Typography.Text color="neutralBase+30" size="title1" weight="medium">
              {t("AllInOneCard.TopUpAndRefundScreen.enterAmount")}
            </Typography.Text>
            <View>
              {!isAddMoney ? (
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
              {selectedTag === options[1] || isAddMoney ? (
                <View style={styles.inputStyle}>
                  <AmountInput
                    testID="AllInOneCard.TopUpAndRefundScreen:AmountInput"
                    control={control}
                    currentBalance={totalBalance}
                    name="enteredValue"
                    showConvertedBalance={false}
                    maxLength={6}
                    AmountType={
                      !isAddMoney
                        ? sourceCurrency
                        : Number(enteredValue) === 0
                        ? ".00 " + destinationCurrency
                        : destinationCurrency
                    }
                    inputColor="neutralBase+30"
                    hideBalanceError={true}
                  />
                </View>
              ) : (
                <Stack direction="horizontal" gap="8p" align="baseline" style={marginTopStyle}>
                  <Typography.Text color="neutralBase+30" size="xxlarge" weight="medium">
                    {totalBalance.toFixed(2)}
                  </Typography.Text>
                  <Typography.Text color="neutralBase+30" size="large" weight="medium">
                    {source.CurrencyCode === sourceCurrency ? source.CurrencyCode : destination.CurrencyCode}
                  </Typography.Text>
                </Stack>
              )}
            </View>
          </View>
          {enteredValue <= totalBalance || (!isAddMoney && selectedTag === options[0]) ? (
            <></>
          ) : (
            <View style={errorMessageContainerStyle}>
              <Typography.Text color="errorBase" size="footnote" align="center" style={errorMessageStyle}>
                {t("AllInOneCard.TopUpAndRefundScreen.amountExceedsBalance")}
              </Typography.Text>
            </View>
          )}
          {source.CurrencyCode !== "SAR" || destination.CurrencyCode !== "SAR" ? (
            <>
              <Stack direction="horizontal" justify="space-between" style={containerStyle}>
                <View>
                  <Typography.Text color="neutralBase+30" size="footnote">
                    {t("AllInOneCard.TopUpAndRefundScreen.convertedAmount")}
                  </Typography.Text>
                  <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                    {isAddMoney
                      ? convertCurrency(enteredValue, destinationCurrency, sourceCurrency).toFixed(2)
                      : selectedTag === options[0]
                      ? convertCurrency(totalBalance, sourceCurrency, destinationCurrency).toFixed(2)
                      : convertCurrency(enteredValue, sourceCurrency, destinationCurrency).toFixed(2)}{" "}
                    {isAddMoney ? sourceCurrency : destinationCurrency}
                  </Typography.Text>
                </View>
                <Pressable
                  testID="AllInOneCard.TopUpAndRefundScreen:SwapCurrencyPressable"
                  onPress={handleSwapCurrency}>
                  <Stack direction="horizontal" gap="8p" style={swapSectionStyle}>
                    <SwapIcon />
                    <Typography.Text color="neutralBase+30" size="footnote" weight="medium">
                      {isAddMoney ? sourceCurrency : destinationCurrency}
                    </Typography.Text>
                  </Stack>
                </Pressable>
              </Stack>
              <Typography.Text color="neutralBase" size="caption1" style={containerStyle}>
                {t("AllInOneCard.TopUpAndRefundScreen.exchangeRate") + " "}{" "}
                {isAddMoney ? CurrencyConversion[destination.CurrencyCode] : CurrencyConversion[source.CurrencyCode]}
              </Typography.Text>
            </>
          ) : (
            <></>
          )}
        </Stack>
        <View style={containerStyle}>
          <Button
            disabled={enteredValue > totalBalance || enteredValue <= 0}
            testID="AllInOneCard.TopUpAndRefundScreen:confirmButton"
            onPress={handleOnSubmitPress}>
            {t("AllInOneCard.TopUpAndRefundScreen.confirmButton")}
          </Button>
        </View>
      </Stack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputStyle: { overflow: "hidden", width: "100%" },
});
