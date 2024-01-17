import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import { AmountInput } from "@/components/Input";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { useCurrentAccount } from "@/hooks/use-accounts";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function CreateRequestScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const account = useCurrentAccount();
  const currentBalance = account.data?.balance ?? 0;
  const { control, watch } = useForm({
    defaultValues: {
      amount: 0,
    },
  });
  const amount = watch().amount;
  const isContinueButtonDisabled = amount === 0;

  const handleOnContinuePress = () => {
    navigation.navigate("Ips.IpsStack", { screen: "IpsStack.EnterBeneficiaryDetails", params: { amount } });
  };

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
    flexGrow: 1,
    width: "100%",
  }));
  return (
    <Page>
      <NavHeader title="Payment Request" />
      <Stack direction="vertical" style={contentContainerStyle} justify="space-between">
        <Stack direction="vertical">
          <Typography.Header size="large">{t("Ips.CreateRequestScreen.title")}</Typography.Header>
          <AmountInput
            inputColor="neutralBase+30"
            showConvertedBalance={false}
            control={control}
            currentBalance={currentBalance}
            name="amount"
            maxLength={10}
          />
        </Stack>
        <Button block={true} onPress={handleOnContinuePress} disabled={isContinueButtonDisabled}>
          <Typography.Text color={isContinueButtonDisabled ? "neutralBase+30" : "neutralBase-60"}>
            {t("Ips.CreateRequestScreen.continue")}
          </Typography.Text>
        </Button>
      </Stack>
    </Page>
  );
}
