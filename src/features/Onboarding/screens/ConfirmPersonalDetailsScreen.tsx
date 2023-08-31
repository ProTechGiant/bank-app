import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, ScrollView, View, ViewStyle } from "react-native";
import * as yup from "yup";

import { WithShadow } from "@/components";
import Accordion from "@/components/Accordion";
import CheckboxInput from "@/components/Form/CheckboxInput";
import SubmitButton from "@/components/Form/SubmitButton";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { getCountryName } from "@/utils";

import { useConfirmPersonalDetails, useNafathDetails } from "../hooks/query-hooks";
import { NafathDetails } from "../types";

interface ConfirmDetailsForm {
  confirmDetailsAreCorrect: boolean;
}

const schema = yup.object({
  confirmDetailsAreCorrect: yup.boolean().isTrue(),
});

export default function ConfirmPersonalDetailsScreen() {
  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const { data, mutateAsync, isLoading } = useNafathDetails();
  const { t } = useTranslation();
  const confirmPersonalDetailsAsync = useConfirmPersonalDetails();
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);
  const [dataAvailable, setDataAvailable] = useState<boolean>(false);

  useEffect(() => {
    if (undefined !== data) return;
    mutateAsync();
  }, [data, mutateAsync]);

  useEffect(() => {
    validateData(data);
  }, [data]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!buttonClicked) {
        navigation.navigate("Onboarding.Iqama");
      }
    }, 900000); // 15minute in milliseconds

    return () => clearTimeout(timer);
  }, [buttonClicked, navigation]);

  const { control, handleSubmit } = useForm<ConfirmDetailsForm>({
    mode: "onBlur",
    resolver: yupResolver(schema),
    defaultValues: {
      confirmDetailsAreCorrect: false,
    },
  });

  const validateData = (details: NafathDetails | undefined) => {
    if (
      details?.EnglishFirstName &&
      details?.EnglishFamilyName &&
      details?.NationalityCode &&
      (details?.IqamaExpiryDateGregorian || details?.IdExpiryDateGregorian) &&
      details?.Addresses?.length &&
      getCountryName(details?.NationalityCode)
    )
      setDataAvailable(true);
    else setDataAvailable(false);
  };

  const handleOnSubmit = async () => {
    try {
      setButtonClicked(true);
      await confirmPersonalDetailsAsync.mutateAsync();
      navigation.navigate("Onboarding.OptionalEmail");
    } catch (error) {
      Alert.alert(t("Onboarding.ConfirmPersonalDetailsScreen.errorText.alert"));
      warn("onboarding", "Could not confirm personal details: ", JSON.stringify(error));
    }
  };

  const detailsCardStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["32p"],
  }));

  const footerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    paddingHorizontal: theme.spacing["20p"],
    paddingTop: theme.spacing["8p"],
    paddingBottom: theme.spacing["32p"],
  }));

  const mainContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
    paddingTop: theme.spacing["12p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader withBackButton={false} title={t("Onboarding.ConfirmPersonalDetailsScreen.navHeaderTitle")}>
        <ProgressIndicator currentStep={1} totalStep={6} />
      </NavHeader>
      <ScrollView contentContainerStyle={mainContainerStyle}>
        <Stack align="stretch" direction="vertical" gap="16p">
          <Typography.Header size="large" weight="bold">
            {t("Onboarding.ConfirmPersonalDetailsScreen.title")}
          </Typography.Header>
          {isLoading ? (
            <ActivityIndicator color="secondary_blueBase-50" size="large" />
          ) : (
            <>
              {undefined !== data ? (
                <WithShadow backgroundColor="neutralBase-50" borderRadius="small" elevation={3}>
                  <View style={detailsCardStyle}>
                    <Stack direction="vertical" gap="16p">
                      <InfoLine
                        label={t("Onboarding.ConfirmPersonalDetailsScreen.infoLineName")}
                        value={concatStr(" ", [data.EnglishFamilyName, data.EnglishFirstName])}
                        testID="Onboarding.ConfirmPersonalDetailsScreen:InfoLineName"
                      />
                      <InfoLine
                        label={t("Onboarding.ConfirmPersonalDetailsScreen.infoLineNationality")}
                        //TODO: TO UPDATE IT WHEN WE WILL GET UPDATED DATA
                        value={getCountryName(data.NationalityCode) || undefined}
                        testID="Onboarding.ConfirmPersonalDetailsScreen:InfoLineNationality"
                      />
                      <InfoLine
                        label={t("Onboarding.ConfirmPersonalDetailsScreen.infoLineExpiry")}
                        value={data.IqamaExpiryDateGregorian || data.IdExpiryDateGregorian}
                        testID="Onboarding.ConfirmPersonalDetailsScreen:InfoLineExpiry"
                      />
                      <InfoLine
                        label={t("Onboarding.ConfirmPersonalDetailsScreen.infoLineAddress")}
                        value={formatAddress(data)}
                        testID="Onboarding.ConfirmPersonalDetailsScreen:InfoLineAddress"
                      />
                    </Stack>
                  </View>
                </WithShadow>
              ) : null}
              <Accordion title={t("Onboarding.ConfirmPersonalDetailsScreen.moreInfoDropdownTitle")}>
                <Typography.Text color="neutralBase" size="footnote" weight="regular">
                  {t("Onboarding.ConfirmPersonalDetailsScreen.moreInfoDropdownBodyOne")}
                  <Typography.Text color="neutralBase" size="footnote" weight="bold">
                    {t("Onboarding.ConfirmPersonalDetailsScreen.moreInfoDropdownBodyTwo")}
                  </Typography.Text>
                  {t("Onboarding.ConfirmPersonalDetailsScreen.moreInfoDropdownBodyThree")}
                </Typography.Text>
              </Accordion>
            </>
          )}
        </Stack>
      </ScrollView>
      <Stack align="stretch" gap="8p" direction="vertical" style={footerStyle}>
        <CheckboxInput
          control={control}
          name="confirmDetailsAreCorrect"
          label={t("Onboarding.ConfirmPersonalDetailsScreen.CheckBoxLabel")}
        />
        <SubmitButton
          isDisabled={!dataAvailable}
          control={control}
          onSubmit={handleSubmit(handleOnSubmit)}
          testID="Onboarding.ConfirmDetails:ContinueButton">
          {t("Onboarding.ConfirmPersonalDetailsScreen.Continue")}
        </SubmitButton>
      </Stack>
    </Page>
  );
}

function concatStr(glue: string, inputs: Array<string | undefined>) {
  const retVal = inputs
    .filter(v => undefined !== v && v.length > 0)
    .join(glue)
    .trim();

  return retVal.length > 0 ? retVal : undefined;
}

function formatAddress(data: NafathDetails) {
  if (!data.Addresses?.length) {
    return;
  }
  const street: string = addSuffix(data.Addresses?.[0]?.StreetName, ", ");
  const city: string = addSuffix(data.Addresses?.[0]?.City, " ");
  const postCode: string = addSuffix(data.Addresses?.[0]?.PostCode, " ");
  const country = addSuffix(getCountryName(data.NationalityCode), "");
  return concatStr("", [street + city + postCode + country]);
}

function addSuffix(value: string | undefined | null, suffix: string): string {
  return value ? value + suffix : "";
}

function InfoLine({ label, value, testID }: { label: string; value?: string; testID: string }) {
  return (
    <View>
      <Typography.Text size="callout" weight="medium" color="primaryBase-40">
        {label}
      </Typography.Text>
      <Typography.Text
        size="footnote"
        weight="regular"
        color={undefined === value ? "errorBase" : "neutralBase+10"}
        testID={testID}>
        {value ?? "Missing from Absher"}
      </Typography.Text>
    </View>
  );
}
