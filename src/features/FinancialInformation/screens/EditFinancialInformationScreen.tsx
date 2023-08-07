import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import * as yup from "yup";

import Button from "@/components/Button";
import DropdownInput from "@/components/Form/DropdownInput";
import SubmitButton from "@/components/Form/SubmitButton";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import { useCustomerProfile } from "@/hooks/use-customer-profile";
import { warn } from "@/logger";
import { useThemeStyles } from "@/theme";

import { ACCOUNT_PURPOSE, MONTHLY_LIMITS, OCCUPATION_CODE, SOURCE_OF_INCOME } from "../constants";
import { useSubmitFinancialDetails } from "../hooks/query-hooks";
import { expectedAmount } from "../mocks/mockExpectedAmount";
import { occupations } from "../mocks/mockOccupation";
import { sourceOfIncome } from "../mocks/mockSourceOfIncome";
import { useCroatia } from "../mocks/mockUseCroatia";
import { EditFinancialInformationScreenProps, FinancialDetails } from "../types";

export default function EditFinancialInformationScreen({ onBackPress }: EditFinancialInformationScreenProps) {
  const { t } = useTranslation();

  const submitFinancialDetailsAsync = useSubmitFinancialDetails();
  const { data: userInformation } = useCustomerProfile();

  const [selectedMonthlyLimit] = useState(userInformation?.FinancialInformation.MonthlyLimit);
  const [selectedSourceOfIncome] = useState(userInformation?.FinancialInformation.SourceOfIncome);
  const [selectedOccupation] = useState(userInformation?.FinancialInformation.OccupationCode);
  const [selectedAccountPurpose] = useState(userInformation?.FinancialInformation.AccountPurpose);

  const validationSchema = yup.object().shape({
    OccupationCode: yup.string(),
    AccountPurpose: yup.string().required(t("Settings.FinancialInformation.validation.requiredAccountPurpose")),
    MonthlyLimit: yup.string().required(t("Settings.FinancialInformation.validation.requiredMonthlyLimits")),
    SourceOfIncome: yup.string().required(t("Settings.FinancialInformation.validation.requiredSourceOfIncome")),
  });

  const { control, handleSubmit, setValue } = useForm<FinancialDetails>({
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    setValue(MONTHLY_LIMITS, selectedMonthlyLimit);
    setValue(SOURCE_OF_INCOME, selectedSourceOfIncome);
    setValue(OCCUPATION_CODE, selectedOccupation);
    setValue(ACCOUNT_PURPOSE, selectedAccountPurpose);
  }, [selectedMonthlyLimit, selectedSourceOfIncome, selectedOccupation, selectedAccountPurpose]);

  const handleOnSubmit = async (data: FinancialDetails) => {
    try {
      await submitFinancialDetailsAsync.mutateAsync(data);
      onBackPress();
    } catch (error) {
      warn("Financial", `Could not submit financial details: ${(error as Error).message}`);
    }
  };

  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    top: theme.spacing["4p"],
  }));

  const containerStyles = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    alignSelf: "center",
    backgroundColor: theme.palette["neutralBase-60"],
    flex: 1,
  }));

  const subtitleStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    alignSelf: "center",
    alignContent: "center",
    borderRadius: theme.radii.medium,
    marginTop: theme.spacing["20p"],
    marginBottom: theme.spacing["8p"],
    paddingHorizontal: theme.spacing["16p"],
  }));

  const dropDownContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["20p"],
    marginVertical: theme.spacing["8p"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    position: "absolute",
    bottom: theme.spacing["4p"],
    marginTop: theme.spacing["16p"],
  }));

  const buttonStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["12p"],
    paddingVertical: theme.spacing["4p"],
  }));

  const optionalTextStyle = useThemeStyles<TextStyle>(theme => ({
    paddingHorizontal: theme.spacing["12p"],
    paddingTop: theme.spacing["4p"],
  }));

  return (
    <Page insets={["left", "right", "bottom"]}>
      <View style={headerStyle}>
        <NavHeader title={t("Settings.FinancialInformation.title")} onBackPress={onBackPress} />
      </View>
      <View style={containerStyles}>
        <View style={styles.headerContainerStyle}>
          <View style={subtitleStyle}>
            <Typography.Text color="neutralBase+30" size="title3" weight="medium">
              {t("Settings.FinancialInformation.subTitle")}
            </Typography.Text>
          </View>
        </View>
        <ScrollView>
          <View>
            <View style={dropDownContainerStyle}>
              <DropdownInput
                isFixedHeight={true}
                control={control}
                name={OCCUPATION_CODE}
                label={t("Settings.FinancialInformation.occupation")}
                placeholder={t("Settings.FinancialInformation.selectAnAmount")}
                options={occupations}
                buttonLabel={t("Settings.FinancialInformation.selectButton")}
                variant="small"
                autoselect
              />

              <Typography.Text color="neutralBase" size="caption1" weight="regular" style={optionalTextStyle}>
                {t("Settings.FinancialInformation.optional")}
              </Typography.Text>
            </View>
            <View style={dropDownContainerStyle}>
              <DropdownInput
                isFixedHeight={true}
                control={control}
                name={ACCOUNT_PURPOSE}
                label={t("Settings.FinancialInformation.useCroatia")}
                placeholder={t("Settings.FinancialInformation.selectAnAmount")}
                options={useCroatia}
                buttonLabel={t("Settings.FinancialInformation.selectButton")}
                variant="small"
                autoselect
              />
            </View>

            <View style={dropDownContainerStyle}>
              <DropdownInput
                control={control}
                name={SOURCE_OF_INCOME}
                label={t("Settings.FinancialInformation.sourceOfIncome")}
                placeholder={t("Settings.FinancialInformation.inputSourceOfIncomePlaceholder")}
                options={sourceOfIncome}
                buttonLabel={t("Settings.FinancialInformation.selectButton")}
                variant="small"
                autoselect
              />
            </View>
            <View style={dropDownContainerStyle}>
              <DropdownInput
                control={control}
                name={MONTHLY_LIMITS}
                label={t("Settings.FinancialInformation.spendEachMonth")}
                placeholder={t("Settings.FinancialInformation.selectAnAmount")}
                options={expectedAmount}
                buttonLabel={t("Settings.FinancialInformation.selectButton")}
                variant="small"
                autoselect
              />
            </View>
          </View>
        </ScrollView>

        <View style={buttonContainerStyle}>
          <View style={buttonStyle}>
            <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
              {t("Settings.FinancialInformation.saveButton")}
            </SubmitButton>
          </View>
          <View style={buttonStyle}>
            <Button onPress={onBackPress} variant="tertiary">
              {t("Settings.FinancialInformation.cancelButton")}
            </Button>
          </View>
        </View>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  headerContainerStyle: {
    alignSelf: "center",
    width: "100%",
  },
});
