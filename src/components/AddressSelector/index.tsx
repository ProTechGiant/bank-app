import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { LocationPinIcon } from "@/assets/icons";
import { WithShadow } from "@/components";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import Radio from "../Radio";

interface AddressSelectorProps {
  id: string;
  addressLineOne: string;
  addressLineTwo?: string;
  addressLineThree?: string;
  addressLineFour?: string;
  isSelected: boolean;
  isTemporary: boolean;
  onPress: (id: string) => void;
}

export default function AddressSelector({
  id,
  addressLineOne,
  addressLineTwo,
  addressLineThree,
  addressLineFour,
  isSelected,
  isTemporary,
  onPress,
}: AddressSelectorProps) {
  const { t } = useTranslation();
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    padding: theme.spacing["16p"],
  }));

  const temporaryTag = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["complimentBase-30"],
    borderRadius: theme.radii.xlarge / 2,
    height: 21,
    paddingHorizontal: theme.spacing["8p"],
    paddingVertical: theme.spacing["4p"],
    gap: 10,
    marginBottom: theme.spacing["8p"],
  }));

  const radioButtonStyle = useThemeStyles<ViewStyle>(() => ({
    alignSelf: "center",
  }));

  return (
    <WithShadow backgroundColor="neutralBase-60" borderRadius="extraSmall">
      <Pressable onPress={() => onPress(id)} style={containerStyle}>
        <View>
          <LocationPinIcon />
        </View>
        <View style={styles.addressContent}>
          {isTemporary && (
            <View style={temporaryTag}>
              <Typography.Text color="complimentBase+20" size="caption2" weight="medium">
                {t("ApplyCards.SetTemporaryAddressScreen.navTitle")}
              </Typography.Text>
            </View>
          )}
          <Typography.Text color="neutralBase+30" size="callout" weight="medium">
            {addressLineOne}
          </Typography.Text>
          {addressLineTwo && (
            <Typography.Text color="neutralBase-10" size="footnote">
              {addressLineTwo}
            </Typography.Text>
          )}
          <Typography.Text color="neutralBase-10" size="footnote">
            {addressLineThree}
          </Typography.Text>
          <Typography.Text color="neutralBase-10" size="footnote">
            {addressLineFour}
          </Typography.Text>
        </View>
        <View style={radioButtonStyle}>
          <Radio isSelected={isSelected} onPress={() => onPress(id)} />
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
});
