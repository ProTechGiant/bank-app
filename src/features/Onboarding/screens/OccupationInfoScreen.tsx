import { RouteProp, useRoute } from "@react-navigation/native";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import { TextInput } from "@/components/Input";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { SelectionModal } from "../components";
import ModalDropdownInput from "../components/ModalDropdownInput";
import { OccupationCodeEnum, ProfessionEnum, SectorEnum } from "../constants";
import { useOnboardingContext } from "../contexts/OnboardingContext";
import { useOnboardingBackButton } from "../hooks";
import { OnboardingStackParams } from "../OnboardingStack";
import { ListItemType, OccupationalInfo } from "../types";
import { convertEnumToArray } from "../utils/convertEnumToArray";

export default function OccupationInfoScreen() {
  const { t } = useTranslation();
  const { isLoading } = useOnboardingContext();
  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const route = useRoute<RouteProp<OnboardingStackParams, "Onboarding.OccupationInfoScreen">>();
  const [occupationalInfo, setOccupationalInfo] = useState<OccupationalInfo | null>(null);
  const handleOnBackPress = useOnboardingBackButton();
  const [selectingItem, setSelectingItem] = useState<{
    header: string;
    listItems: ListItemType[];
    type: string;
  } | null>(null);

  const handleOnSubmit = async () => {
    if (!occupationalInfo) return;
    navigation.navigate("Onboarding.IncomeDetailsScreen", { userName: route.params.userName, occupationalInfo });
  };

  const preSelectedItem = useMemo(() => {
    if (selectingItem?.type === "profession") {
      return occupationalInfo?.Profession;
    } else if (selectingItem?.type === "occupation") {
      return occupationalInfo?.Occupation;
    } else if (selectingItem?.type === "seator") {
      return occupationalInfo?.Sector;
    }
    return "";
  }, [selectingItem]);

  const isSubmitButtonDisabled = useMemo(() => {
    const { Profession, Occupation, Sector, CompanyName } = occupationalInfo || {};

    if (!Profession) return true;
    if (["01", "02", "03"].includes(Profession)) {
      return !(Occupation && Sector && CompanyName);
    }

    return false;
  }, [occupationalInfo]);

  const isOtherFieldsVisible = useMemo(() => {
    return (
      occupationalInfo?.Profession === "01" ||
      occupationalInfo?.Profession === "02" ||
      occupationalInfo?.Profession === "03"
    );
  }, [occupationalInfo]);

  const handleOnSelectItem = (value: string) => {
    if (selectingItem?.type === "profession") {
      setOccupationalInfo({ ...occupationalInfo, Profession: value });
    } else if (selectingItem?.type === "seator") {
      setOccupationalInfo({ ...occupationalInfo, Sector: value });
    } else if (selectingItem?.type === "occupation") {
      setOccupationalInfo({ ...occupationalInfo, Occupation: value });
    } else {
      setOccupationalInfo({ ...occupationalInfo, CompanyName: value });
    }
    setSelectingItem(null);
  };

  const handleOnOpenSelectionModal = (header: string, listItems: ListItemType[], type: string) => {
    setSelectingItem({ header, listItems, type: type });
  };

  const handleOnGetLabel = (enumObj: Record<string, string>, value: string) => {
    const [item] = convertEnumToArray(enumObj).filter(e => e.value === value);
    return item?.label;
  };

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: theme.spacing["12p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader onBackPress={handleOnBackPress} withBackButton={true} title="">
        <ProgressIndicator currentStep={3} totalStep={5} />
      </NavHeader>
      {isLoading ? (
        <View style={styles.loading}>
          <FullScreenLoader />
        </View>
      ) : (
        <ContentContainer isScrollView>
          <Stack align="stretch" direction="vertical" gap="20p">
            <Stack direction="vertical" gap="4p">
              <Typography.Text size="title3">
                {t("Onboarding.OccupationalInfoScreen.welcome")} {route.params.userName}
              </Typography.Text>
              <Typography.Text size="title1" weight="medium">
                {t("Onboarding.OccupationalInfoScreen.title")}
              </Typography.Text>
            </Stack>
            <ModalDropdownInput
              header={t("Onboarding.OccupationalInfoScreen.profession")}
              inputLabel={
                handleOnGetLabel(ProfessionEnum, occupationalInfo?.Profession ?? "") ??
                t("Onboarding.OccupationalInfoScreen.selectAProfession")
              }
              modalHeader={t("Onboarding.OccupationalInfoScreen.selectProfession")}
              onPress={handleOnOpenSelectionModal}
              options={convertEnumToArray(ProfessionEnum)}
              type="profession"
            />
            {isOtherFieldsVisible ? (
              <>
                <ModalDropdownInput
                  header={t("Onboarding.OccupationalInfoScreen.sector")}
                  inputLabel={
                    handleOnGetLabel(SectorEnum, occupationalInfo?.Sector ?? "") ??
                    t("Onboarding.OccupationalInfoScreen.selectASector")
                  }
                  modalHeader={t("Onboarding.OccupationalInfoScreen.selectSector")}
                  onPress={handleOnOpenSelectionModal}
                  options={convertEnumToArray(SectorEnum)}
                  type="seator"
                />
                <ModalDropdownInput
                  header={t("Onboarding.OccupationalInfoScreen.occupation")}
                  inputLabel={
                    handleOnGetLabel(OccupationCodeEnum, occupationalInfo?.Occupation ?? "") ??
                    t("Onboarding.OccupationalInfoScreen.natureOfWork")
                  }
                  modalHeader={t("Onboarding.OccupationalInfoScreen.selectOccupation")}
                  onPress={handleOnOpenSelectionModal}
                  options={convertEnumToArray(OccupationCodeEnum)}
                  type="occupation"
                />
                <Stack direction="vertical" align="stretch">
                  <TextInput
                    variant="small"
                    pointerEvents="none"
                    placeholder={t("Onboarding.OccupationalInfoScreen.enterCompanyName")}
                    value={occupationalInfo?.CompanyName}
                    label={t("Onboarding.OccupationalInfoScreen.companyName")}
                    onChangeText={handleOnSelectItem}
                  />
                </Stack>
              </>
            ) : null}
          </Stack>
        </ContentContainer>
      )}
      {}
      <Stack align="stretch" gap="8p" direction="vertical" style={buttonContainerStyle}>
        <Button disabled={isSubmitButtonDisabled} onPress={handleOnSubmit}>
          {t("Onboarding.OccupationalInfoScreen.continue")}
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

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    marginTop: -68,
  },
});
