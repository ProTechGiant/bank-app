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
//TODO useFetchAccount will be needed for getting the accountId
// import useFetchAccount from "@/features/Home/screens/DashboardScreen/AccountInfoHeader/use-fetch-account";
import MainStackParams from "@/navigation/MainStackParams";
import useNavigation from "@/navigation/use-navigation";

import AccountDestination from "../../components/AccountDestination";
import { mockMissingSavingsPotDetails } from "../../mocks/mockMissingSavingsPotDetails";
import { useSavingsPot } from "../../query-hooks";
//TODO useWithdrawSavingsPot will be needed for getting the accountId
// import { useWithdrawSavingsPot } from "../../query-hooks";
import LargeCurrencyInput from "../FundGoalModal/LargeCurrencyInput";

interface WithdrawInput {
  Amount: number;
}

export default function WithdrawGoalModal() {
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

  // For testing before API endpoint its done, switch error state manually to check both modal types (error and confirm), will be replace with state
  const withdrawError = false;
  const navigation = useNavigation();
  const { i18n, t } = useTranslation();
  const route = useRoute<RouteProp<MainStackParams, "SavingsGoals.WithdrawGoalModal">>();

  const { data } = useSavingsPot(route.params.PotId);

  //TODO accountId will be needed for the API call
  // const whitdrawSavingsPot = useWithdrawSavingsPot(route.params.SavingsPotId);
  // const {
  //   data: { accountId },
  // } = useFetchAccount();

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      Amount: yup
        .number()
        .required()
        .min(0.01)
        .max(mockMissingSavingsPotDetails.MainAccountAmount ?? 0, t("SavingsGoals.WithdrawModal.amountExceedsBalance")),
    });
  }, [data, i18n.language]);

  const { control, handleSubmit } = useForm<WithdrawInput>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      Amount: 0,
    },
  });

  const handleOnClose = () => {
    navigation.navigate("SavingsGoals.GoalDetailsScreen", {
      PotId: route.params.PotId,
      amountWithdrawn: undefined,
    });
  };

  // TODO
  // Mofidify this function to make the call in the BE when API its ready

  const handleOnSubmit = (value: WithdrawInput) => {
    if (undefined === data) return Promise.resolve();

    if (withdrawError) {
      setIsConfirmationVisible(true);
    } else {
      navigation.navigate("SavingsGoals.GoalDetailsScreen", {
        PotId: route.params.PotId,
        amountWithdrawn: value.Amount,
      });
    }

    // TODO POST request with the following details
    //   PaymentAmount: value.Amount.toString(),
    //   Currency: "SAR",
    //   CreditorAccount: accountId.toString(),
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

          <LargeCurrencyInput autoFocus control={control} maxLength={10} name="Amount" />

          {undefined !== data && (
            <AccountDestination
              destination={t("SavingsGoals.Account.to")}
              accountName={t("SavingsGoals.Account.mainAccount")}
              balance={mockMissingSavingsPotDetails.MainAccountAmount}
            />
          )}

          <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
            {t("SavingsGoals.WithdrawModal.WithdrawButton")}
          </SubmitButton>
        </ContentContainer>

        <NotificationModal
          buttons={
            withdrawError && {
              primary: (
                <Button onPress={handleSubmit(handleOnSubmit)}>
                  {t("SavingsGoals.WithdrawModal.buttons.tryAgainButton")}
                </Button>
              ),
              secondary: (
                <Button onPress={handleOnClose}>
                  {t("SavingsGoals.WithdrawModal.buttons.cancelWithdrawalButton")}
                </Button>
              ),
            }
          }
          title={t("SavingsGoals.WithdrawModal.errors.title")}
          message={t("SavingsGoals.WithdrawModal.errors.text")}
          isVisible={isConfirmationVisible}
          variant="error"
        />
      </Page>
    </SafeAreaProvider>
  );
}
