import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaView, ScrollView, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import MoreInfoDropdown from "../../components/MoreInfoDropdown";
import AddCountryTile from "./AddCountryTile";
import SelectedFtrCard from "./SelectedFtr";

export interface FtrCountries {
  key: number;
  country: string;
  uniqueReference: string;
}

const FatcaDetailsScreen = () => {
  const { t } = useTranslation();
  const route = useRoute();
  const selectedCountry = route.params;
  const navigation = useNavigation();
  const [hasFtr, setHasFtr] = useState<boolean | undefined>(undefined);
  const [yesSelected, noSelected] = hasFtr === true ? [true, false] : hasFtr === false ? [false, true] : [false, false];
  const [ftrCountries, setFtrCountries] = useState<Array<FtrCountries>>([]);
  const [disableContinue, setDisableContinue] = useState(
    hasFtr === false
      ? false
      : hasFtr === undefined
      ? true
      : hasFtr === true && Array.isArray(ftrCountries) && !ftrCountries.length
      ? true
      : false
  );

  useEffect(() => {
    if (ftrCountries.length >= 3) throw new Error("Cannot Add Any more countries");

    if (selectedCountry !== undefined) {
      const country: FtrCountries = selectedCountry.selectedCountries[0];

      setFtrCountries([
        ...ftrCountries,
        {
          key: ftrCountries.length - 1,
          country: country.country,
          uniqueReference: country.uniqueReference,
        },
      ]);
      console.log(ftrCountries);
    }
  }, [selectedCountry]);

  useEffect(() => {
    setDisableContinue(
      hasFtr === false
        ? false
        : hasFtr === undefined
        ? true
        : hasFtr === true && Array.isArray(ftrCountries) && !ftrCountries.length
        ? true
        : false
    );
  }, [ftrCountries, hasFtr]);

  const footerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing.regular,
  }));
  const yesButton = useThemeStyles<ViewStyle>(
    theme => ({
      borderRadius: theme.radii.small,
      marginRight: theme.spacing.medium,
      flex: 1,
      alignSelf: "stretch",
    }),
    []
  );
  const noButton = useThemeStyles<ViewStyle>(
    theme => ({
      borderRadius: theme.radii.small,
      marginLeft: theme.spacing.medium,
      flex: 1,
      alignSelf: "stretch",
    }),
    []
  );

  const addCountry = () => {
    navigation.navigate("Onboarding.CountrySelector");
  };

  const handleSubmit = () => {
    navigation.navigate("Onboarding.Terms");
  };

  return (
    <>
      <Page>
        <NavHeader title={t("Onboarding.FatcaDetailsScreen.navHeaderTitle")} backButton={true}>
          <ProgressIndicator currentStep={5} totalStep={6} />
        </NavHeader>
        <ScrollView>
          <ContentContainer style={{ marginBottom: 64 }}>
            <Stack direction="vertical" gap="medium" align="stretch">
              <Typography.Header size="medium" weight="bold">
                {t("Onboarding.FatcaDetailsScreen.title")}
              </Typography.Header>
              <Typography.Text size="callout" weight="medium" color="primaryBase">
                {t("Onboarding.FatcaDetailsScreen.subHeader")}
              </Typography.Text>
              <View
                style={{
                  flexDirection: "row",
                  padding: 10,
                }}>
                <View style={yesButton}>
                  <Button
                    variant={yesSelected ? "primary" : "secondary"}
                    onPress={() => {
                      setHasFtr(true);
                    }}>
                    {t("Onboarding.FatcaDetailsScreen.yes")}
                  </Button>
                </View>
                <View style={noButton}>
                  <Button
                    variant={noSelected ? "primary" : "secondary"}
                    onPress={() => {
                      setHasFtr(false);
                    }}>
                    {t("Onboarding.FatcaDetailsScreen.no")}
                  </Button>
                </View>
              </View>
              <MoreInfoDropdown title={t("Onboarding.FatcaDetailsScreen.moreInfoDropdownTitle")}>
                <Typography.Text color="neutralBase" size="footnote">
                  {t("Onboarding.FatcaDetailsScreen.moreInfoDropdownBody")}
                </Typography.Text>
              </MoreInfoDropdown>
              {hasFtr &&
                ftrCountries.map((country, index) => (
                  <SelectedFtrCard
                    key={index}
                    index={index}
                    country={country.country}
                    uniqueReference={country.uniqueReference}
                  />
                ))}
              {ftrCountries.length < 3 && hasFtr && <AddCountryTile onPress={addCountry} />}
            </Stack>
          </ContentContainer>
        </ScrollView>
        <View style={footerStyle}>
          <SafeAreaView>
            <Button onPress={handleSubmit} disabled={disableContinue}>
              {t("Onboarding.FatcaDetailsScreen.continue")}
            </Button>
          </SafeAreaView>
        </View>
      </Page>
    </>
  );
};
export default FatcaDetailsScreen;
