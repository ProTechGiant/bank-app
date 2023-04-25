import { yupResolver } from "@hookform/resolvers/yup";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { I18nManager, KeyboardAvoidingView, Platform, Pressable, View, ViewStyle } from "react-native";
import * as yup from "yup";

import { ArrowForwardIcon } from "@/assets/icons";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useAccount from "@/hooks/use-account";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { PersonalReasons, TransferAmountInput } from "../components";
import { useInternalTransferContext } from "../context/InternalTransfersContext";
import { useTransferReasons } from "../hooks/query-hooks";
import { TransferValue } from "../types";

export default function InternalTransferScreen() {
  const { t } = useTranslation();
  const account = useAccount();
  const navigation = useNavigation();
  const reasons = useTransferReasons();
  const { setTransferAmount, setReason } = useInternalTransferContext();

  const currentBalance = account.data?.currentAccountBalance;

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      PaymentAmount: yup
        .number()
        .required()
        .min(0.01)
        .max(
          undefined !== currentBalance ? Number(currentBalance) : 0,
          t("InternalTransfers.InternalTransferScreen.errorMessage")
        ),
    });
  }, [t, currentBalance]);

  const {
    formState: { isDirty, isValid },
    control,
    handleSubmit,
  } = useForm<TransferValue>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      PaymentAmount: 0,
      TransferReason: { Description: "", Code: "" },
    },
  });

  const [isReasonSelected, setIsReasonSelected] = useState(false);

  const isDisabled = !isDirty || !isValid || !isReasonSelected;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleOnNextPress = (values: TransferValue) => {
    setTransferAmount(values.PaymentAmount);
    setReason(values.TransferReason.Description);
    navigation.navigate("InternalTransfers.SendToBeneficiaryScreen");
  };

  const handleOnAddFunds = () => {
    navigation.navigate("AddMoney.AddMoneyStack", { screen: "AddMoney.AddMoneyInfoScreen" });
  };

  const container = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  const titleContainer = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["64p"],
  }));

  const buttonContainer = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    marginBottom: theme.spacing["20p"],
  }));

  const buttonStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.primaryBase,
    paddingLeft: 55,
    paddingRight: 51,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    flexDirection: "row",
  }));

  const buttonDisableStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
  }));

  const buttonTextStyle = useThemeStyles<ViewStyle>(theme => ({
    marginRight: theme.spacing["8p"],
  }));

  const iconColorDisable = useThemeStyles(theme => theme.palette["neutralBase-20"], []);
  const iconColor = useThemeStyles(theme => theme.palette["neutralBase-50"], []);

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader onBackPress={handleBack} />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <View style={container}>
            <Typography.Text color="neutralBase+30" weight="semiBold" size="title1" style={titleContainer}>
              {t("InternalTransfers.InternalTransferScreen.title")}
            </Typography.Text>
          </View>
          <TransferAmountInput
            autoFocus
            control={control}
            maxLength={10}
            name="PaymentAmount"
            balance={currentBalance}
            onAddFund={handleOnAddFunds}
          />
          <PersonalReasons
            reasons={reasons?.TransferReason ?? []}
            control={control}
            name="TransferReason"
            updateReasonState={setIsReasonSelected}
          />
          <Stack align="flex-end" direction="vertical" justify="space-between" flex={1}>
            <View />
            <View style={buttonContainer}>
              <Pressable
                style={[buttonStyle, isDisabled && buttonDisableStyle]}
                disabled={isDisabled}
                onPress={handleSubmit(handleOnNextPress)}>
                <Typography.Text
                  color={isDisabled ? "neutralBase-20" : "neutralBase-50"}
                  weight="semiBold"
                  size="body"
                  style={buttonTextStyle}>
                  {t("InternalTransfers.InternalTransferScreen.next")}
                </Typography.Text>
                <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
                  <ArrowForwardIcon color={isDisabled ? iconColorDisable : iconColor} />
                </View>
              </Pressable>
            </View>
          </Stack>
        </KeyboardAvoidingView>
      </Page>
    </>
  );
}
