import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import * as yup from "yup";

import CheckboxInput from "@/components/Form/CheckboxInput";
import SubmitButton from "@/components/Form/SubmitButton";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { generateShadow, useThemeStyles } from "@/theme";

import { MoreInfoDropdown } from "../components";
import { useConfirmPersonalDetails, useNafathDetails } from "../hooks/query-hooks";

interface ConfirmDetailsForm {
  confirmDetailsAreCorrect: boolean;
}

const schema = yup.object({
  confirmDetailsAreCorrect: yup.boolean().isTrue(),
});

export default function ConfirmPersonalDetailsScreen() {
  const navigation = useNavigation();
  const { data, mutateAsync } = useNafathDetails();
  const { t } = useTranslation();
  const confirmPersonalDetailsAsync = useConfirmPersonalDetails();

  useEffect(() => {
    if (undefined !== data) return;
    mutateAsync();
  }, []);

  const { control, handleSubmit } = useForm<ConfirmDetailsForm>({
    mode: "onBlur",
    resolver: yupResolver(schema),
    defaultValues: {
      confirmDetailsAreCorrect: false,
    },
  });

  const handleOnSubmit = async () => {
    try {
      await confirmPersonalDetailsAsync.mutateAsync();
      navigation.navigate("Onboarding.OptionalEmail");
    } catch (error) {
      Alert.alert(t("Onboarding.ConfirmPersonalDetailsScreen.errorText.alert"));
      warn("onboarding", "Could not confirm personal details: ", JSON.stringify(error));
    }
  };

  const detailsCardStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-50"],
    borderRadius: theme.radii.small,
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["32p"],
  }));

  const footerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-50"],
    paddingHorizontal: theme.spacing["20p"],
    paddingBottom: theme.spacing["32p"],
  }));

  return (
    <Page insets={["top"]}>
      <NavHeader withBackButton={false} title={t("Onboarding.ConfirmPersonalDetailsScreen.navHeaderTitle")}>
        <ProgressIndicator currentStep={1} totalStep={6} />
      </NavHeader>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12 }}>
        <Stack align="stretch" direction="vertical" gap="16p">
          <Typography.Header size="large" weight="bold">
            {t("Onboarding.ConfirmPersonalDetailsScreen.title")}
          </Typography.Header>
          {undefined !== data && (
            <View style={[detailsCardStyle, styles.shadow]}>
              <Stack direction="vertical" gap="16p">
                <InfoLine
                  label={t("Onboarding.ConfirmPersonalDetailsScreen.infoLineName")}
                  value={concatStr(" ", [data.EnglishFamilyName, data.EnglishFirstName])}
                />
                <InfoLine
                  label={t("Onboarding.ConfirmPersonalDetailsScreen.infoLineNationality")}
                  value={data.Nationality}
                />
                <InfoLine
                  label={t("Onboarding.ConfirmPersonalDetailsScreen.infoLineExpiry")}
                  value={data.IqamaExpiryDateGregorian}
                />
                <InfoLine
                  label={t("Onboarding.ConfirmPersonalDetailsScreen.infoLineAddress")}
                  value={concatStr(" ", [
                    data.Addresses?.[0]?.StreetName +
                      ", " +
                      data.Addresses?.[0]?.City +
                      " " +
                      data.Addresses?.[0]?.PostCode,
                    ", Saudi Arabia",
                  ])}
                />
              </Stack>
            </View>
          )}
          <MoreInfoDropdown title={t("Onboarding.ConfirmPersonalDetailsScreen.moreInfoDropdownTitle")}>
            <Typography.Text color="neutralBase" size="footnote" weight="regular">
              {t("Onboarding.ConfirmPersonalDetailsScreen.moreInfoDropdownBodyOne")}
              <Typography.Text color="neutralBase" size="footnote" weight="bold">
                {t("Onboarding.ConfirmPersonalDetailsScreen.moreInfoDropdownBodyTwo")}
              </Typography.Text>
              {t("Onboarding.ConfirmPersonalDetailsScreen.moreInfoDropdownBodyThree")}
            </Typography.Text>
          </MoreInfoDropdown>
        </Stack>
      </ScrollView>
      <View style={footerStyle}>
        <Stack align="stretch" gap="8p" direction="vertical">
          <View />
          <CheckboxInput
            control={control}
            isEditable={true}
            bordered={false}
            name="confirmDetailsAreCorrect"
            label={t("Onboarding.ConfirmPersonalDetailsScreen.CheckBoxLabel")}
          />
          <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
            {t("Onboarding.ConfirmPersonalDetailsScreen.Continue")}
          </SubmitButton>
        </Stack>
      </View>
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

function InfoLine({ label, value }: { label: string; value: string | undefined }) {
  return (
    <View>
      <Typography.Text size="callout" weight="medium" color="primaryBase-40">
        {label}
      </Typography.Text>
      <Typography.Text size="footnote" weight="regular" color={undefined === value ? "errorBase" : "neutralBase+10"}>
        {value ?? "Missing from Absher"}
      </Typography.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: generateShadow(3),
});
