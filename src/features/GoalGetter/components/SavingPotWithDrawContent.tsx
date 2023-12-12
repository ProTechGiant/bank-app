import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import { AmountInput } from "@/components/Input";
import { useToasts } from "@/contexts/ToastsContext";
import { predefinedWeights } from "@/features/GoldWallet/mock";
import { useThemeStyles } from "@/theme";

import { ErrorIcon } from "../assets/icons";
import { SavingPotsType } from "../utils";
import PurchaseTag from "./PurchaseTag";

interface GoldTradeContentProps {
  totalBalance: number;
  handleOnContinuePress: (values: any) => void;
  savingPot: number;
  savingPotType: string;
  isMutualFund?: boolean;
}
export default function SavingPotWithDrawContent({
  totalBalance,
  handleOnContinuePress,
  savingPot,
  savingPotType,
  isMutualFund,
}: GoldTradeContentProps) {
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
      if (savingPot === selectedWeight) {
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
      setSelectedWeight(savingPot);
      setIsActive([true, false]);
    } else {
      setIsActive([false, true]);
    }
  };

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

  const fullWidthContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
    width: "100%",
  }));

  const downContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["64p"],
    width: "100%",
  }));

  const hintTextStyle = useThemeStyles(theme => ({
    marginStart: theme.spacing["12p"],
  }));
  const options = ["Full", "Partially"];

  return (
    <>
      <Typography.Text color="neutralBase+30" size="title2" weight="medium">
        {t("Home.DashboardScreen.GoalGetter.actionsSummary.enterAmount")}
      </Typography.Text>

      {savingPotType === SavingPotsType.WITHDRAW && (
        <Stack direction="horizontal" justify="space-between" style={styles.ingotsWeightContainerStyle}>
          {options.map((item, index) => {
            return (
              <PurchaseTag key={index} title={item} onPress={() => handleTagChoosen(item)} active={isActive[index]} />
            );
          })}
        </Stack>
      )}
      <AmountInput
        hasGoldLabel={true}
        autoFocus
        control={control}
        currentBalance={savingPot}
        maxLength={8}
        name="goldWeight"
        showConvertedBalance={false}
        AmountType={".00 " + t("GoldWallet.SAR")}
        inputColor="neutralBase+30"
      />
      {selectedWeight > totalBalance && isMutualFund && (
        <Stack direction="horizontal" style={errorMessageContainerStyle} gap="12p">
          <View style={hintTextStyle}>
            <ErrorIcon />
          </View>
          <Typography.Text color="neutralBase+30" size="footnote" weight="regular">
            {t("Home.DashboardScreen.GoalGetter.actionsSummary.mutualFundLimit")}
          </Typography.Text>
        </Stack>
      )}
      {selectedWeight > savingPot && savingPotType === SavingPotsType.WITHDRAW && !isMutualFund && (
        <Stack direction="horizontal" style={errorMessageContainerStyle} gap="12p">
          <View style={hintTextStyle}>
            <ErrorIcon />
          </View>
          <Typography.Text color="neutralBase+30" size="footnote" weight="regular">
            {t("Home.DashboardScreen.GoalGetter.actionsSummary.savingPotLimit")}
          </Typography.Text>
        </Stack>
      )}

      {isActive[1] &&
        selectedWeight <= savingPot &&
        selectedWeight !== 0 &&
        savingPotType === SavingPotsType.WITHDRAW && (
          <>
            <Typography.Text color="neutralBase+30" size="title3" weight="bold">
              {t("Home.DashboardScreen.GoalGetter.actionsSummary.remainingAmount")}
            </Typography.Text>

            <Stack direction="horizontal" style={remainingStyle}>
              <Typography.Text color="neutralBase+30" size="callout" weight="semiBold">
                {savingPot - selectedWeight}
                <Typography.Text color="neutralBase+30" size="caption1" weight="regular">
                  {((savingPot % selectedWeight) % 1).toFixed(2).replace("0.", ".")} SAR
                </Typography.Text>
              </Typography.Text>
            </Stack>
          </>
        )}
      {selectedWeight > totalBalance && savingPotType === SavingPotsType.ADDMONEY && !isMutualFund && (
        <Stack direction="horizontal" style={errorMessageContainerStyle} gap="12p">
          <View style={hintTextStyle}>
            <ErrorIcon />
          </View>
          <Typography.Text color="neutralBase+30" size="footnote" weight="regular">
            {t("Home.DashboardScreen.GoalGetter.actionsSummary.savingPotAddMoneyLimit")}
          </Typography.Text>
        </Stack>
      )}
      {selectedWeight < totalBalance && selectedWeight !== 0 && savingPotType === SavingPotsType.ADDMONEY && (
        <Stack direction="vertical" style={downContainerStyle} gap="8p">
          <Typography.Text color="neutralBase+30" size="title3" weight="bold">
            {t("Home.DashboardScreen.GoalGetter.actionsSummary.remainingAmount")}
          </Typography.Text>

          <Stack direction="horizontal" style={remainingStyle}>
            <Typography.Text color="neutralBase+30" size="callout" weight="semiBold">
              {totalBalance - selectedWeight}
              <Typography.Text color="neutralBase+30" size="caption1" weight="regular">
                {((totalBalance % selectedWeight) % 1).toFixed(2).replace("0.", ".")} SAR
              </Typography.Text>
            </Typography.Text>
          </Stack>
        </Stack>
      )}
      <View style={fullWidthContainerStyle}>
        <Button
          testID="Home.DashboardScreen.GoalGetter.actionsSummary.confirm"
          disabled={selectedWeight > savingPot || selectedWeight === 0}
          onPress={handleSubmit(handleOnSubmitPress)}>
          {t("Home.DashboardScreen.GoalGetter.actionsSummary.confirm")}
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  ingotsWeightContainerStyle: {
    width: "40%",
  },
});
