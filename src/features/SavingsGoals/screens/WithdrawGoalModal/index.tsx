import { yupResolver } from "@hookform/resolvers/yup";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as yup from "yup";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import SubmitButton from "@/components/Form/SubmitButton";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import MainStackParams from "@/navigation/MainStackParams";
import useNavigation from "@/navigation/use-navigation";

import AccountDestination from "../../components/AccountDestination";
import { mockMissingSavingsPotDetails } from "../../mocks/mockMissingSavingsPotDetails";
import { useSavingsPot, useWithdrawSavingsPot, WithdrawValues } from "../../query-hooks";
import LargeCurrencyInput from "../FundGoalModal/LargeCurrencyInput";

export default function WithdrawGoalModal() {
  const [withdrawError, setWithdrawError] = useState(false);

  const navigation = useNavigation();
  const { t } = useTranslation();
  const route = useRoute<RouteProp<MainStackParams, "SavingsGoals.WithdrawGoalModal">>();

  const { data } = useSavingsPot(route.params.PotId);
  const withdrawSavingsPot = useWithdrawSavingsPot();

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
    if (undefined === data) return Promise.resolve();
    try {
      await withdrawSavingsPot.mutateAsync({
        ...values,
        Currency: "SAR",
        CreditorAccount: data.RecurringPayments.CreditorAccount,
        PotId: route.params.PotId,
      });

      navigation.navigate("SavingsGoals.GoalDetailsScreen", {
        PotId: route.params.PotId,
        amountWithdrawn: values.PaymentAmount,
      });
    } catch (error) {
      setWithdrawError(true);
    }
  };

  return (
    <SafeAreaProvider>
      <Page>
        <ContentContainer style={{ justifyContent: "space-between" }}>
          <NavHeader
            onBackPress={handleOnClose}
            withBackButton={false}
            title={t("SavingsGoals.WithdrawModal.title")}
            end={<NavHeader.CloseEndButton onPress={handleOnClose} />}
          />

          <LargeCurrencyInput autoFocus control={control} maxLength={10} name="PaymentAmount" />

          <AccountDestination
            destination={t("SavingsGoals.Account.to")}
            accountName={t("SavingsGoals.Account.mainAccount")}
            balance={mockMissingSavingsPotDetails.MainAccountAmount}
          />

          <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
            {t("SavingsGoals.WithdrawModal.WithdrawButton")}
          </SubmitButton>
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
          isVisible={withdrawError}
          variant="error"
        />
      </Page>
    </SafeAreaProvider>
  );
}
