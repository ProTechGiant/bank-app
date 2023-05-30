import { yupResolver } from "@hookform/resolvers/yup";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as yup from "yup";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import SubmitButton from "@/components/Form/SubmitButton";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import { useCurrentAccount } from "@/hooks/use-accounts";
import { warn } from "@/logger";
import MainStackParams from "@/navigation/mainStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { AccountDestination, LargeCurrencyInput } from "../components";
import { useSavingsPot, useWithdrawSavingsPot, WithdrawValues } from "../hooks/query-hooks";

export default function WithdrawGoalModal() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const route = useRoute<RouteProp<MainStackParams, "SavingsGoals.WithdrawGoalModal">>();

  const { data } = useSavingsPot(route.params.PotId);
  const withdrawSavingsPot = useWithdrawSavingsPot();
  const account = useCurrentAccount();

  const [isWithdrawError, setIsWithdrawError] = useState(false);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      PaymentAmount: yup
        .number()
        .required()
        .min(0.01, t("SavingsGoals.WithdrawModal.zeroAmountError"))
        .max(
          undefined !== data?.AvailableBalanceAmount ? Number(data.AvailableBalanceAmount) : 0,
          t("SavingsGoals.WithdrawModal.amountExceedsBalance")
        ),
    });
  }, [t, data]);

  const { control, handleSubmit } = useForm<WithdrawValues>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      PaymentAmount: 0,
    },
  });

  const handleOnClose = () => {
    navigation.navigate("SavingsGoals.GoalDetailsScreen", {
      PotId: route.params.PotId,
    });
  };

  const handleOnSubmit = async (values: WithdrawValues) => {
    if (data === undefined || account.data === undefined) return Promise.resolve();

    try {
      await withdrawSavingsPot.mutateAsync({
        ...values,
        Currency: "SAR",
        CreditorAccount: account.data.id,
        PotId: route.params.PotId,
      });

      navigation.navigate("SavingsGoals.GoalDetailsScreen", {
        PotId: route.params.PotId,
        amountWithdrawn: values.PaymentAmount,
      });
    } catch (error) {
      setIsWithdrawError(true);
      warn("savings-pots", "Could not withdraw from savings pot", JSON.stringify(error));
    }
  };

  const keyboardVerticalOffset = 195;

  const submitButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["20p"],
  }));

  const contentContainer = useThemeStyles<ViewStyle>(theme => ({
    justifyContent: "space-between",
    marginTop: theme.spacing["64p"],
  }));

  return (
    <SafeAreaProvider>
      <Page>
        <NavHeader
          onBackPress={handleOnClose}
          withBackButton={false}
          title={t("SavingsGoals.WithdrawModal.title")}
          end={<NavHeader.CloseEndButton onPress={handleOnClose} />}
        />
        <ContentContainer style={contentContainer}>
          <LargeCurrencyInput autoFocus control={control} maxLength={10} name="PaymentAmount" />

          <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={keyboardVerticalOffset}>
            <AccountDestination
              destination={t("SavingsGoals.Account.to")}
              accountName={t("SavingsGoals.Account.mainAccount")}
              balance={account.data?.balance || 0}
            />
            <View style={submitButtonStyle}>
              <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
                {t("SavingsGoals.WithdrawModal.WithdrawButton")}
              </SubmitButton>
            </View>
          </KeyboardAvoidingView>
        </ContentContainer>

        <NotificationModal
          buttons={{
            primary: (
              <Button loading={withdrawSavingsPot.isLoading} onPress={handleSubmit(handleOnSubmit)}>
                {t("SavingsGoals.WithdrawModal.buttons.tryAgainButton")}
              </Button>
            ),
            secondary: (
              <Button onPress={handleOnClose}>{t("SavingsGoals.WithdrawModal.buttons.cancelWithdrawalButton")}</Button>
            ),
          }}
          title={t("SavingsGoals.WithdrawModal.errors.title")}
          message={t("SavingsGoals.WithdrawModal.errors.text")}
          isVisible={isWithdrawError}
          variant="error"
        />
      </Page>
    </SafeAreaProvider>
  );
}
