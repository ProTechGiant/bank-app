import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as yup from "yup";

import ContentContainer from "@/components/ContentContainer";
import DayPickerInput from "@/components/Form/DayPickerInput";
import SubmitButton from "@/components/Form/SubmitButton";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import useNavigation from "@/navigation/use-navigation";

import FromAccount from "../../components/FromAccount";
import LargeCurrencyInput from "../../components/LargeCurrencyInput";

interface FundRecurringDepositInput {
  amount: number;
  dayOfMonth: number;
}

const ACCOUNT_BALANCE = 80000;

const validationSchema = yup.object().shape({
  amount: yup.number().required().max(ACCOUNT_BALANCE, "Account exceeds your balance").min(0),
  dayOfMonth: yup.number().required().min(1).max(31),
});

export default function FundRecurringDepositScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const { control, handleSubmit } = useForm<FundRecurringDepositInput>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      amount: 0,
      dayOfMonth: new Date().getDate(),
    },
  });

  const handleOnClose = () => {
    navigation.goBack();
  };

  const handleOnSubmit = (values: FundRecurringDepositInput) => {
    // ..
  };

  return (
    <SafeAreaProvider>
      <Page keyboardAvoiding>
        <NavHeader
          withBackButton={false}
          title={t("SavingsGoals.FundRecurringDepositScreen.title")}
          end={<NavHeader.CloseEndButton onPress={handleOnClose} />}
        />
        <ContentContainer style={{ flex: 1, justifyContent: "space-between" }}>
          <Stack align="stretch" direction="vertical" gap="16p">
            <LargeCurrencyInput control={control} name="amount" />
            <DayPickerInput
              buttonText={t("SavingsGoals.FundRecurringDepositScreen.dayPickerButton")}
              control={control}
              headerText={t("SavingsGoals.FundRecurringDepositScreen.dayPickerHeader")}
              label={t("SavingsGoals.FundRecurringDepositScreen.monthly")}
              name="dayOfMonth"
              placeholder={t("SavingsGoals.FundRecurringDepositScreen.dayPickerPlaceholder")}
            />
            <FromAccount name={t("SavingsGoals.fromAccount.mainAccount")} balance={ACCOUNT_BALANCE} />
          </Stack>
          <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
            Continue
          </SubmitButton>
        </ContentContainer>
      </Page>
    </SafeAreaProvider>
  );
}
