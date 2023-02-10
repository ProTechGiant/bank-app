import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView, View, ViewStyle } from "react-native";
import * as yup from "yup";

import { CalendarAltIcon, GlobeIcon, MapMarkerIcon, UserIcon } from "@/assets/icons";
import CheckboxInput from "@/components/Form/CheckboxInput";
import SubmitButton from "@/components/Form/SubmitButton";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import MoreInfoDropdown from "../../components/MoreInfoDropdown";
import useNafathDetails from "./use-nafath-details";

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

  const handleOnSubmit = () => {
    navigation.navigate("Onboarding.OptionalEmail");
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
    <Page safeAreaInsets={["top"]} isPadded={false}>
      <NavHeader withBackButton={false} title={t("Onboarding.ConfirmPersonalDetailsScreen.navHeaderTitle")}>
        <ProgressIndicator currentStep={1} totalStep={6} />
      </NavHeader>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12 }}>
        <Stack align="stretch" direction="vertical" gap="16p">
          <Typography.Header size="large" weight="bold">
            {t("Onboarding.ConfirmPersonalDetailsScreen.title")}
          </Typography.Header>
          {undefined !== data && (
            <View style={detailsCardStyle}>
              <Stack direction="vertical" gap="16p">
                <InfoLine
                  icon={<UserIcon />}
                  label={t("Onboarding.ConfirmPersonalDetailsScreen.infoLineName")}
                  value={concatStr(" ", [data.EnglishFamilyName, data.EnglishFirstName])}
                />
                <InfoLine
                  icon={<GlobeIcon />}
                  label={t("Onboarding.ConfirmPersonalDetailsScreen.infoLineNationality")}
                  value={data.Nationality}
                />
                <InfoLine
                  icon={<CalendarAltIcon />}
                  label={t("Onboarding.ConfirmPersonalDetailsScreen.infoLineExpiry")}
                  value={data.IqamaExpiryDateGregorian}
                />
                <InfoLine
                  icon={<MapMarkerIcon />}
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

function InfoLine({ icon, label, value }: { icon: React.ReactElement; label: string; value: string | undefined }) {
  return (
    <View>
      <Typography.Text size="callout" weight="medium" color="primaryBase">
        {label}
      </Typography.Text>
      <Stack direction="horizontal" gap="8p">
        {icon}
        <Typography.Text size="footnote" weight="regular" color={undefined === value ? "errorBase" : "primaryBase"}>
          {value ?? "Missing from Absher"}
        </Typography.Text>
      </Stack>
    </View>
  );
}
