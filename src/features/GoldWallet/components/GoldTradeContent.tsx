import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import InfoBox from "@/components/InfoBox";
import { AmountInput } from "@/components/Input";
import { useToasts } from "@/contexts/ToastsContext";
import { useThemeStyles } from "@/theme";

import { TollIcon } from "../assets";
import { predefinedWeights } from "../mock";
// import { TradeTypeEnum } from "../types";  //TODO
import GramTag from "./GramTag";

interface GoldTradeContentProps {
  totalBalance: number;
  handleOnContinuePress: (values: any) => void;
  marketPrice: number;
}
export default function GoldTradeContent({ totalBalance, handleOnContinuePress, marketPrice }: GoldTradeContentProps) {
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
  }));
  const ingotsWeightContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["12p"],
    width: "70%",
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

  return (
    <>
      <Typography.Text color="neutralBase+30" size="title1" weight="medium" style={TextStyle}>
        {t("GoldWallet.TradeGoldScreen.entergrams")}
      </Typography.Text>
      <AmountInput
        autoFocus
        control={control}
        currentBalance={marketPrice}
        maxLength={5}
        name="goldWeight"
        AmountType={t("GoldWallet.grams")}
        inputColor="neutralBase+30"
      />
      <Typography.Text color="neutralBase+30" size="callout" weight="medium" style={TextStyle}>
        {t("GoldWallet.TradeGoldScreen.preDefinedAmount")}
      </Typography.Text>
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
      <Button
        testID="InternalTransfers.QuickTransferScreen:ContinueButton"
        disabled={goldWeight === 0}
        onPress={handleSubmit(handleOnSubmitPress)}>
        {t("InternalTransfers.QuickTransferScreen.continueButton")}
      </Button>
    </>
  );
}
