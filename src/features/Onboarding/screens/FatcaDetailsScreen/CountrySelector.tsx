import { useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";

import { FtrCountries } from ".";

// interface Props {
//   onAdd: (country: FtrCountries[]) => void;
// }

const CountrySelector = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const editParams = route.params;

  const [selectedCountry, setSelectedCountry] = useState<Array<FtrCountries>>([
    {
      country: "Country 3",
      uniqueReference: "3",
    },
  ]);

  if (editParams !== undefined) {
    console.log(editParams.index.index);
    // setSelectedCountry({
    //     country: editParams.country",
    //     uniqueReference: "2",
    // })
  }

  const addCountry = () => {
    navigation.navigate("Onboarding.Fatca", {
      selectedCountries: selectedCountry,
    });
  };
  //   const saveEdit = () => {
  //     navigation.navigate("Onboarding.Fatca", {
  //       selectedCountries: selectedCountry,
  //     });
  //   };
  //   const removeCountry = () => {
  //     navigation.navigate("Onboarding.Fatca", {
  //       selectedCountries: selectedCountry,
  //     });
  //   };
  return (
    <Page>
      <NavHeader
        title={t("Onboarding.FatcaDetailsScreen.CountrySelector.navHeaderTitle")}
        backButton={false}
        rightComponent="close"
      />
      <ContentContainer>
        <View>
          {/* ... */}
          {editParams === undefined && <Button onPress={addCountry}>Add</Button>}
          {editParams !== undefined && (
            <>
              <Button onPress={saveEdit}>Continue</Button>
              <Button onPress={removeCountry}>Remove</Button>
            </>
          )}
        </View>
      </ContentContainer>
    </Page>
  );
};

export default CountrySelector;
