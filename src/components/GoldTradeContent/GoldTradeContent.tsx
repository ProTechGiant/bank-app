import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView, TextStyle, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import InfoBox from "@/components/InfoBox";
import { AmountInput } from "@/components/Input";
import { useToasts } from "@/contexts/ToastsContext";
import { TollIcon } from "@/features/GoldWallet/assets";
import { GramTag } from "@/features/GoldWallet/components";
import { predefinedWeights } from "@/features/GoldWallet/mock";
import { useThemeStyles } from "@/theme";
import { TransactionTypeEnum } from "@/types/GoldTransactions";

interface GoldTradeContentProps {
  totalBalance: number;
  handleOnContinuePress: (values: any) => void;
  marketPrice: number;
  walletWeight: number | null;
  goldWeightValue: number;
  tradeType: TransactionTypeEnum;
}
export default function GoldTradeContent({
  totalBalance,
  handleOnContinuePress,
  marketPrice,
  walletWeight,
  goldWeightValue,
  tradeType,
}: GoldTradeContentProps) {
  const { t } = useTranslation();
  const addToast = useToasts();
  const [selectedWeight, setSelectedWeight] = useState(0);
  const { control, handleSubmit, watch, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      goldWeight: 0,
    },
  });
  const goldWeight = watch("goldWeight");
  const isPriceExceedsBalance = totalBalance > marketPrice * (marketPrice ?? selectedWeight);
  const isWeightExceedsLimit = goldWeightValue < goldWeight;

  useEffect(() => {
    setSelectedWeight(goldWeight);
  }, [goldWeight]);

  useEffect(() => {
    if (selectedWeight) {
      reset({ goldWeight: selectedWeight });
    }
  }, [selectedWeight]);

  const handleOnSubmitPress = (values: any) => {
    if (goldWeight < predefinedWeights[0].value) {
      // TODO message will be replace when BA team give us the text of it
      addToast({
        variant: "negative",
        message: t("GoldWallet.TradeGoldScreen.invalidgoldWeightMessage"),
        position: "top",
      });
    } else {
      const weight = values.goldWeight ?? selectedWeight;
      handleOnContinuePress(weight);
    }
  };

  const TextStyle = useThemeStyles(theme => ({
    marginVertical: theme.spacing["8p"],
  }));

  const calculatedPriceContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["24p"],
    width: "100%",
    borderRadius: 80,
  }));
  const ingotsWeightContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["12p"],
  }));

  const errorMessageContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["8p"],
    paddingVertical: theme.spacing["20p"],
    marginVertical: theme.spacing["12p"],
    backgroundColor: theme.palette["complimentBase-30"],
    borderWidth: 1,
    borderRadius: theme.radii.small,
    borderColor: theme.palette["complimentBase-30"],
  }));

  const hintTextStyle = useThemeStyles(theme => ({
    marginVertical: theme.spacing["12p"],
    marginBottom: theme.spacing["12p"],
  }));
  const ownTextStyle = useThemeStyles<TextStyle>(theme => ({
    marginStart: theme.spacing["4p"],
    maxWidth: "95%",
  }));

  return (
    <>
      <Typography.Text color="neutralBase+30" size="title1" weight="medium" style={TextStyle}>
        {t("GoldWallet.TradeGoldScreen.entergrams")}
      </Typography.Text>
      <Stack direction="horizontal" align="flex-end" justify="space-between">
        <View>
          <AmountInput
            autoFocus
            control={control}
            currentBalance={marketPrice}
            maxLength={5}
            name="goldWeight"
            AmountType={t("GoldWallet.grams")}
            inputColor="neutralBase+30"
          />
        </View>

        {walletWeight ? (
          <Stack direction="vertical" align="center" justify="center">
            <Typography.Text color="primaryBase-40" size="callout" weight="medium" style={ownTextStyle}>
              {t("GoldWallet.TradeGoldScreen.own") + " : " + walletWeight}
            </Typography.Text>
          </Stack>
        ) : null}
      </Stack>

      <Typography.Text color="neutralBase+30" size="callout" weight="medium" style={TextStyle}>
        {t("GoldWallet.TradeGoldScreen.preDefinedAmount")}
      </Typography.Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <Stack direction="horizontal" justify="space-between" style={ingotsWeightContainerStyle}>
          {predefinedWeights.map((item, index) => {
            return (
              <GramTag
                key={index}
                title={item.label}
                onPress={() => setSelectedWeight(item.value)}
                active={selectedWeight === item.value}
              />
            );
          })}
        </Stack>
      </ScrollView>
      <Stack direction="horizontal" style={calculatedPriceContainerStyle}>
        <InfoBox
          icon={<TollIcon />}
          variant="success"
          title={`${marketPrice * (goldWeight ?? selectedWeight)} ${t("GoldWallet.SAR")}`}
        />
      </Stack>
      {isPriceExceedsBalance ? (
        <Stack direction="horizontal" style={errorMessageContainerStyle}>
          <Typography.Text color="complimentBase" size="footnote" weight="regular">
            {t("GoldWallet.TradeGoldScreen.insufficientFunds")}
          </Typography.Text>
        </Stack>
      ) : (
        <Typography.Text color="neutralBase+10" size="footnote" weight="regular" style={hintTextStyle}>
          {t("GoldWallet.TradeGoldScreen.currentPriceIndicative")}
        </Typography.Text>
      )}
      {tradeType === TransactionTypeEnum.SELL && isWeightExceedsLimit && (
        <Typography.Text color="neutralBase+10" size="footnote" weight="regular" style={errorMessageContainerStyle}>
          {t("GoldWallet.TradeGoldScreen.exceedLimitErrorMessage", { weight: goldWeightValue })}
        </Typography.Text>
      )}
      <Button
        testID="InternalTransfers.QuickTransferScreen:ContinueButton"
        disabled={goldWeight === 0}
        onPress={handleSubmit(handleOnSubmitPress)}>
        {t("InternalTransfers.QuickTransferScreen.continueButton")}
      </Button>
    </>
  );
}
