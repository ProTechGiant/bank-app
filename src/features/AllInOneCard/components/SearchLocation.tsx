import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";
import SearchableDropdown from "react-native-searchable-dropdown";
import { SvgProps } from "react-native-svg";

import useThemeStyles from "@/theme/use-theme-styles";

import { Location } from "../types";

interface SearchLocationProps {
  selectedLocation: Location | undefined;
  onLocationSelect: (selectedLocation: Location) => void;
  startIcon: React.ReactElement<SvgProps>;
  locations: Location[];
}
export default function SearchLocation({
  selectedLocation,
  onLocationSelect,
  startIcon,
  locations,
}: SearchLocationProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["8p"],
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.radii.small,
    paddingStart: theme.spacing["32p"],
  }));

  const itemContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["12p"],
  }));

  const searchIconStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["12p"],
    marginHorizontal: theme.spacing["4p"],
    position: "absolute",
  }));

  return (
    <View>
      <SearchableDropdown
        value={selectedLocation}
        multi={true}
        selectedItems={selectedLocation}
        onItemSelect={(item: Location) => {
          onLocationSelect(item);
        }}
        itemStyle={itemContainerStyle}
        itemsContainerStyle={styles.listHight}
        items={locations}
        chip={true}
        resetValue={false}
        textInputProps={{
          placeholder: t("AllInOneCard.PINAddressScreen.SearchInputPlaceholder"),
          underlineColorAndroid: "transparent",
          style: {
            ...containerStyle,
          },
        }}
        listProps={{
          nestedScrollEnabled: true,
        }}
      />
      <View style={searchIconStyle}>{startIcon}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  listHight: { maxHeight: 140 },
});
