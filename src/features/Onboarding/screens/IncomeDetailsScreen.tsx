import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import Stack from "@/components/Stack";
import Toggle from "@/components/Toggle";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import { mockExpectedAmount } from "@/mocks/expectedAmount";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { SelectionModal } from "../components";
import ModalDropdownInput from "../components/ModalDropdownInput";
import { AdditionalIncomeTypeEnum, IncomeAmountEnum, MainIncomeEnum } from "../constants";
import { useOnboardingBackButton } from "../hooks";
import { useSubmitFinancialDetails } from "../hooks/query-hooks";
import { OnboardingStackParams } from "../OnboardingStack";
import { FinancialDetails, IncomeSpendingDetails, ListItemType } from "../types";
import { convertEnumToArray } from "../utils/convertEnumToArray";

export default function IncomeDetailsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const route = useRoute<RouteProp<OnboardingStackParams, "Onboarding.IncomeDetailsScreen">>();
  const [selectingItem, setSelectingItem] = useState<{
    header: string;
    listItems: ListItemType[];
    type: string;
  } | null>(null);
  const [incomeSpendingDetails, setIncomeSpendingDetails] = useState<IncomeSpendingDetails | null>(null);
  const [haveAdditonalInfo, setHaveAdditonalInfo] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const { mutateAsync: submitFinancialDetailsAsync, isLoading, isError } = useSubmitFinancialDetails();
  const handleOnBackPress = useOnboardingBackButton();

  useEffect(() => {
    setIsErrorModalVisible(isError);
  }, [isError]);

  const isSubmitButtonDisabled = useMemo(() => {
    const { MainIncomeType, MonthlyDebitAndCreditAmount, MonthlyLimit, AdditionalIncomeAmount, AdditionalIncomeType } =
      incomeSpendingDetails || {};
    if (!incomeSpendingDetails || !MainIncomeType || !MonthlyDebitAndCreditAmount || !MonthlyLimit) {
      return true;
    }
    if (haveAdditonalInfo && (!AdditionalIncomeAmount || !AdditionalIncomeType)) {
      return true;
    }
    return false;
  }, [incomeSpendingDetails, haveAdditonalInfo]);

  const handleOnSubmit = async () => {
    try {
      const values: FinancialDetails = {
        AdditionalIncomeFlag: haveAdditonalInfo,
        MainIncome: incomeSpendingDetails?.MainIncomeType ?? "",
        MonthlyDebitCreditAmount: incomeSpendingDetails?.MonthlyDebitAndCreditAmount ?? "",
        MonthlyLimit: incomeSpendingDetails?.MonthlyLimit ?? "",
        Profession: route.params.Profession ?? "",
      };

      if (route.params.Sector) {
        values.Sector = route.params.Sector;
      }
      if (route.params.CompanyName) {
        values.CompanyName = route.params.CompanyName;
      }
      if (route.params.Occupation) {
        values.OccupationCode = route.params.Occupation;
      }
      if (haveAdditonalInfo) {
        values.AdditionalIncomeType = incomeSpendingDetails?.AdditionalIncomeType;
        values.AdditionalIncomeAmount = incomeSpendingDetails?.AdditionalIncomeAmount;
      }

      await submitFinancialDetailsAsync(values);
      navigation.navigate("Onboarding.Fatca");
    } catch (error) {
      warn("onboarding", `Could not submit financial details: ${(error as Error).message}`);
    }
  };

  const preSelectedItem = useMemo(() => {
    if (selectingItem?.type === "additionalIncomeAmount") {
      return incomeSpendingDetails?.AdditionalIncomeAmount;
    } else if (selectingItem?.type === "additionalIncomeType") {
      return incomeSpendingDetails?.AdditionalIncomeType;
    } else if (selectingItem?.type === "incomeAmount") {
      return incomeSpendingDetails?.MonthlyLimit;
    } else if (selectingItem?.type === "incomeType") {
      return incomeSpendingDetails?.MainIncomeType;
    } else if (selectingItem?.type === "craditAndDebitAmount") {
      return incomeSpendingDetails?.MonthlyDebitAndCreditAmount;
    } else {
      return "";
    }
  }, [selectingItem]);

  const handleOnSelectItem = (value: string) => {
    if (selectingItem?.type === "additionalIncomeAmount") {
      setIncomeSpendingDetails({ ...incomeSpendingDetails, AdditionalIncomeAmount: value });
    } else if (selectingItem?.type === "additionalIncomeType") {
      setIncomeSpendingDetails({ ...incomeSpendingDetails, AdditionalIncomeType: value });
    } else if (selectingItem?.type === "incomeAmount") {
      setIncomeSpendingDetails({ ...incomeSpendingDetails, MonthlyLimit: value });
    } else if (selectingItem?.type === "incomeType") {
      setIncomeSpendingDetails({ ...incomeSpendingDetails, MainIncomeType: value });
    } else {
      setIncomeSpendingDetails({ ...incomeSpendingDetails, MonthlyDebitAndCreditAmount: value });
    }
    setSelectingItem(null);
  };

  const handleOnOpenSelectionModal = (header: string, listItems: ListItemType[], type: string) => {
    setSelectingItem({ header, listItems, type: type });
  };

  const handleOnToggleHaveAdditionalInfo = () => {
    if (haveAdditonalInfo) {
      setHaveAdditonalInfo(false);
      setIncomeSpendingDetails({
        ...incomeSpendingDetails,
        AdditionalIncomeType: undefined,
        AdditionalIncomeAmount: undefined,
      });
    } else {
      setHaveAdditonalInfo(true);
    }
  };

  const handleOnGetLabel = (array: ListItemType[], value: string) => {
    const [item] = array.filter(e => e.value === value);
    if (item) {
      return t(`Onboarding.FinancialInfoSelectionModal.${item?.label}`);
    }
    return null;
  };

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: theme.spacing["12p"],
  }));

  const verticalPadding = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        title={<ProgressIndicator currentStep={3} totalStep={5} />}
        pageNumber="3/5"
        withBackButton={true}
        onBackPress={handleOnBackPress}
      />

      <ContentContainer isScrollView>
        <Stack align="stretch" direction="vertical" gap="20p">
          <Stack direction="vertical" gap="4p">
            <Typography.Text size="title3">
              {t("Onboarding.IncomeDetailsScreen.welcome")} {route.params.userName}
            </Typography.Text>
            <Typography.Text size="title1" weight="medium">
              {t("Onboarding.IncomeDetailsScreen.title")}
            </Typography.Text>
          </Stack>

          <ModalDropdownInput
            header={t("Onboarding.IncomeDetailsScreen.whatIsMainTypeIncome")}
            inputLabel={
              handleOnGetLabel(convertEnumToArray(MainIncomeEnum), incomeSpendingDetails?.MainIncomeType ?? "") ??
              t("Onboarding.IncomeDetailsScreen.selectMainIncome")
            }
            modalHeader={t("Onboarding.IncomeDetailsScreen.selectType")}
            onPress={handleOnOpenSelectionModal}
            options={convertEnumToArray(MainIncomeEnum)}
            type="incomeType"
          />

          <ModalDropdownInput
            header={t("Onboarding.IncomeDetailsScreen.whatIsAmountOfMainIncome")}
            inputLabel={
              handleOnGetLabel(mockExpectedAmount, incomeSpendingDetails?.MonthlyLimit ?? "") ??
              t("Onboarding.IncomeDetailsScreen.selectIncomeAmount")
            }
            modalHeader={t("Onboarding.IncomeDetailsScreen.selectAmount")}
            onPress={handleOnOpenSelectionModal}
            options={mockExpectedAmount}
            type="incomeAmount"
          />

          <ModalDropdownInput
            header={t("Onboarding.IncomeDetailsScreen.monthlyDebitCreditAmount")}
            inputLabel={
              handleOnGetLabel(
                convertEnumToArray(IncomeAmountEnum),
                incomeSpendingDetails?.MonthlyDebitAndCreditAmount ?? ""
              ) ?? t("Onboarding.IncomeDetailsScreen.selectAnAmount")
            }
            modalHeader={t("Onboarding.IncomeDetailsScreen.selectAmount")}
            onPress={handleOnOpenSelectionModal}
            options={convertEnumToArray(IncomeAmountEnum)}
            type="craditAndDebitAmount"
          />

          <Stack direction="horizontal" justify="space-between" align="center" style={verticalPadding}>
            <Typography.Text weight="medium">
              {t("Onboarding.IncomeDetailsScreen.doYouHaveAdditionalIncome")}
            </Typography.Text>
            <Toggle onPress={handleOnToggleHaveAdditionalInfo} value={haveAdditonalInfo} />
          </Stack>
          {haveAdditonalInfo ? (
            <ModalDropdownInput
              header={t("Onboarding.IncomeDetailsScreen.additionalIncomeType")}
              inputLabel={
                handleOnGetLabel(
                  convertEnumToArray(AdditionalIncomeTypeEnum),
                  incomeSpendingDetails?.AdditionalIncomeType ?? ""
                ) ?? t("Onboarding.IncomeDetailsScreen.selectAnType")
              }
              modalHeader={t("Onboarding.IncomeDetailsScreen.selectType")}
              onPress={handleOnOpenSelectionModal}
              options={convertEnumToArray(AdditionalIncomeTypeEnum)}
              type="additionalIncomeType"
            />
          ) : null}

          {haveAdditonalInfo ? (
            <ModalDropdownInput
              header={t("Onboarding.IncomeDetailsScreen.additonalIncomeAmount")}
              inputLabel={
                handleOnGetLabel(
                  convertEnumToArray(IncomeAmountEnum),
                  incomeSpendingDetails?.AdditionalIncomeAmount ?? ""
                ) ?? t("Onboarding.IncomeDetailsScreen.selectAnAmount")
              }
              modalHeader={t("Onboarding.IncomeDetailsScreen.selectAmount")}
              onPress={handleOnOpenSelectionModal}
              options={convertEnumToArray(IncomeAmountEnum)}
              type="additionalIncomeAmount"
            />
          ) : null}
        </Stack>
      </ContentContainer>
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("Onboarding.IncomeDetailsScreen.selectAmount")}
        isVisible={isErrorModalVisible}
        onClose={() => setIsErrorModalVisible(false)}
      />
      <Stack align="stretch" gap="8p" direction="vertical" style={buttonContainerStyle}>
        <Button disabled={isSubmitButtonDisabled} loading={isLoading} onPress={handleOnSubmit}>
          {t("Onboarding.IncomeDetailsScreen.continue")}
        </Button>
      </Stack>
      <SelectionModal
        isVisible={!!selectingItem}
        listItems={selectingItem?.listItems ?? []}
        header={selectingItem?.header ?? ""}
        onClose={() => setSelectingItem(null)}
        preSelectedValue={preSelectedItem}
        onSelect={handleOnSelectItem}
      />
    </Page>
  );
}
