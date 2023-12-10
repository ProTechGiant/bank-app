import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import { AmountInput } from "@/components/Input";
import { useToasts } from "@/contexts/ToastsContext";
import { predefinedWeights } from "@/features/GoldWallet/mock";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import { ErrorIcon } from "../assets/icons";
import PurchaseTag from "./PurchaseTag";

interface GoldTradeContentProps {
  totalBalance: number;
  handleOnContinuePress: (values: any) => void;
  marketPrice: number;
}
export default function SellGoldContent({ totalBalance, handleOnContinuePress, marketPrice }: GoldTradeContentProps) {
  const { t } = useTranslation();
  const addToast = useToasts();
  const [selectedWeight, setSelectedWeight] = useState(0);
  const [isActive, setIsActive] = useState([false, false]);

  const { control, handleSubmit, watch, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      goldWeight: 0,
    },
  });
  const goldWeight = watch("goldWeight");

  useEffect(() => {
    setSelectedWeight(goldWeight);
  }, [goldWeight]);

  useEffect(() => {
    if (selectedWeight) {
      if (Math.floor(totalBalance / marketPrice) === selectedWeight) {
        setIsActive([true, false]);
      } else {
        setIsActive([false, true]);
      }
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
  const handleTagChoosen = item => {
    if (item === options[0]) {
      setSelectedWeight(Math.floor(totalBalance / marketPrice));
      setIsActive([true, false]);
    } else {
      setIsActive([false, true]);
    }
  };

  const TextStyle = useThemeStyles(theme => ({
    marginVertical: theme.spacing["8p"],
  }));

  const fullWidthContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
    width: "100%",
  }));

  const ingotsWeightContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["12p"],
    width: "40%",
  }));

  const errorMessageContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["8p"],
    paddingVertical: theme.spacing["20p"],
    marginVertical: theme.spacing["12p"],
    backgroundColor: theme.palette["errorBase-30"],
    borderRadius: theme.radii.regular,
    width: "100%",
  }));
  const remainingStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.small,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  }));

  const hintTextStyle = useThemeStyles(theme => ({
    marginStart: theme.spacing["12p"],
  }));
  const options = ["Full", "Partially"];

  return (
    <>
      <Typography.Text color="neutralBase+30" size="title1" weight="medium" style={TextStyle}>
        {t("GoldWallet.TradeGoldScreen.entergrams")}
      </Typography.Text>
      <Typography.Text color="neutralBase-10" size="callout">
        {t("InternalTransfers.TransferAmountInput.goldPrice") +
          formatCurrency(marketPrice, "SAR") +
          t("InternalTransfers.TransferAmountInput.perGram")}
      </Typography.Text>
      <Stack direction="horizontal" justify="space-between" style={ingotsWeightContainerStyle}>
        {options.map((item, index) => {
          return (
            <PurchaseTag key={index} title={item} onPress={() => handleTagChoosen(item)} active={isActive[index]} />
          );
        })}
      </Stack>
      <AmountInput
        hasGoldLabel={true}
        autoFocus
        control={control}
        currentBalance={marketPrice}
        maxLength={5}
        name="goldWeight"
        showConvertedBalance={false}
        AmountType={t("GoldWallet.grams")}
        inputColor="neutralBase+30"
      />

      {selectedWeight < 5 && (
        <Stack direction="horizontal" style={errorMessageContainerStyle} gap="12p">
          <View style={hintTextStyle}>
            <ErrorIcon />
          </View>
          <Typography.Text color="neutralBase+30" size="footnote" weight="regular">
            {t("Home.DashboardScreen.GoalGetter.actionsSummary.lessThan5")}
          </Typography.Text>
        </Stack>
      )}
      <Stack direction="vertical" gap="4p">
        <Typography.Text color="neutralBase+30" size="callout" weight="medium">
          {t("Home.DashboardScreen.GoalGetter.actionsSummary.equals")}
        </Typography.Text>
        <Typography.Text color="neutralBase+30" size="callout" weight="bold">
          {selectedWeight * marketPrice}
          <Typography.Text color="neutralBase+30" size="footnote" weight="regular">
            .00SAR
          </Typography.Text>
        </Typography.Text>
      </Stack>
      {isActive[1] && (
        <>
          <Typography.Text color="neutralBase+30" size="title3" weight="bold">
            {t("Home.DashboardScreen.GoalGetter.actionsSummary.remainingGoldAmount")}
          </Typography.Text>

          <Stack direction="horizontal" style={remainingStyle}>
            <Typography.Text color="neutralBase+30" size="callout" weight="semiBold">
              42 Grams
            </Typography.Text>
            <Typography.Text color="neutralBase+30" size="callout" weight="semiBold">
              8,820
              <Typography.Text color="neutralBase+30" size="caption1" weight="regular">
                .00 SAR
              </Typography.Text>
            </Typography.Text>
          </Stack>
        </>
      )}
      <View style={fullWidthContainerStyle}>
        <Button
          testID="Home.DashboardScreen.GoalGetter.actionsSummary.confirm"
          disabled={goldWeight < 5}
          onPress={handleSubmit(handleOnSubmitPress)}>
          {t("Home.DashboardScreen.GoalGetter.actionsSummary.confirm")}
        </Button>
      </View>
    </>
  );
}
