import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { ChevronRightIcon, LocationPinIcon } from "@/assets/icons";
import { WithShadow } from "@/components";
import Radio from "@/components/Radio";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { palette } from "@/theme/values";

import Badge from "../Badge";

interface AddressSelectorProps {
  label?: string;
  addressLineOne: string;
  addressLineTwo?: string;
  addressLineThree?: string;
  addressLineFour?: string;
  isSelected: boolean;
  isTemporary: boolean;
  endComponent?: "radio" | "chevron";
  testID?: string;
  onPress: () => void;
}

export default function AddressSelector({
  label,
  addressLineOne,
  addressLineTwo,
  addressLineThree,
  addressLineFour,
  isSelected,
  isTemporary,
  endComponent = "radio",
  testID,
  onPress,
}: AddressSelectorProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    padding: theme.spacing["16p"],
  }));

  return (
    <WithShadow backgroundColor="neutralBase-60" borderRadius="extraSmall">
      <Pressable onPress={onPress} style={containerStyle} testID={testID}>
        <LocationPinIcon color={isSelected ? palette["primaryBase-40"] : palette["neutralBase-30"]} />
        <View style={styles.addressContent}>
          {isTemporary ? (
            <Badge label={t("AddressSelector.temporaryAddressLabel")} />
          ) : label ? (
            <Badge label={label} />
          ) : null}
          <Typography.Text color="neutralBase+30" size="callout" weight="medium">
            {addressLineOne}
          </Typography.Text>
          <Typography.Text color="neutralBase-10" size="footnote">
            {addressLineTwo}
          </Typography.Text>
          <Typography.Text color="neutralBase-10" size="footnote">
            {addressLineThree}
          </Typography.Text>
          <Typography.Text color="neutralBase-10" size="footnote">
            {addressLineFour}
          </Typography.Text>
        </View>
        <View style={styles.endComponent}>
          {endComponent === "radio" ? (
            <Radio
              isSelected={isSelected}
              color={isSelected ? palette["primaryBase-40"] : palette["neutralBase-30"]}
              onPress={onPress}
            />
          ) : (
            <ChevronRightIcon color={palette["neutralBase-30"]} />
          )}
        </View>
      </Pressable>
    </WithShadow>
  );
}

const styles = StyleSheet.create({
  addressContent: {
    alignItems: "flex-start",
    flex: 1,
    marginLeft: 12,
  },
  endComponent: {
    alignSelf: "center",
  },
});
