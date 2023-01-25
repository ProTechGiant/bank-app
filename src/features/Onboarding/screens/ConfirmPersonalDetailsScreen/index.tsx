import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { SafeAreaView, ScrollView, View, ViewStyle } from "react-native";
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
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.xlarge,
  }));

  const footerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-50"],
    paddingHorizontal: theme.spacing.regular,
  }));

  return (
    <>
      <Page>
        <NavHeader title="CONFIRMATION" backButton={true}>
          <ProgressIndicator currentStep={1} totalStep={6} />
        </NavHeader>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12 }}>
          <Stack align="stretch" direction="vertical" gap="medium">
            <Typography.Header size="large" weight="bold">
              Confirm your personal details
            </Typography.Header>
            {undefined !== data && (
              <View style={detailsCardStyle}>
                <Stack direction="vertical" gap="medium">
                  <InfoLine
                    icon={<UserIcon />}
                    label="Full name"
                    value={concatStr(" ", [data.EnglishFamilyName, data.EnglishFirstName])}
                  />
                  <InfoLine icon={<GlobeIcon />} label="Nationality" value={data.Nationality} />
                  <InfoLine icon={<CalendarAltIcon />} label="ID/ Iqama expiry" value={data.IqamaExpiryDateGregorian} />
                  <InfoLine
                    icon={<MapMarkerIcon />}
                    label="KSA address"
                    value={concatStr(" ", [
                      data.Addresses?.[0]?.StreetName,
                      data.Addresses?.[0]?.City + " " + data.Addresses?.[0]?.PostCode,
                      "Saudi Arabia",
                    ])}
                  />
                </Stack>
              </View>
            )}
            <MoreInfoDropdown title="I need to change my details">
              <Typography.Text color="neutralBase" size="footnote" weight="regular">
                Visit
                <Typography.Text color="neutralBase" size="footnote" weight="bold">
                  {" "}
                  absher.sa{" "}
                </Typography.Text>
                to change your details. Please restart the process when your Absher profile has been updated. This can
                take up to 72 hours.
              </Typography.Text>
            </MoreInfoDropdown>
          </Stack>
        </ScrollView>
      </Page>
      <View style={footerStyle}>
        <SafeAreaView>
          <Stack align="stretch" gap="small" direction="vertical">
            <View />
            <CheckboxInput
              control={control}
              isEditable={true}
              name="confirmDetailsAreCorrect"
              label="I confirm my details are correct"
            />
            <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
              Continue
            </SubmitButton>
          </Stack>
        </SafeAreaView>
      </View>
    </>
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
      <Stack direction="horizontal" gap="small">
        {icon}
        <Typography.Text size="footnote" weight="regular" color={undefined === value ? "errorBase" : "primaryBase"}>
          {value ?? "Missing from Absher"}
        </Typography.Text>
      </Stack>
    </View>
  );
}
