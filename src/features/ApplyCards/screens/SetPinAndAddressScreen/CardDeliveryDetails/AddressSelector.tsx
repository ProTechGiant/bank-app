import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { LocationPinIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { generateShadow, useThemeStyles } from "@/theme";

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
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-50"],
    borderRadius: theme.radii.extraSmall,
    flexDirection: "row",
    padding: theme.spacing["16p"],
  }));

  const isSelectedStyle = useThemeStyles<ViewStyle>(theme => ({
    borderColor: theme.palette["primaryBase-40"],
    borderWidth: 2,
  }));

  const temporaryTag = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["primaryBase-10"],
    borderRadius: theme.radii.xxlarge,
    height: 21,
    paddingHorizontal: theme.spacing["8p"],
    paddingVertical: theme.spacing["4p"],
  }));

  const locationIconContainer = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["neutralBase-30"],
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    }),
    []
  );

  return (
    <Pressable onPress={() => onPress(id)} style={[containerStyle, styles.shadow, isSelected && isSelectedStyle]}>
      <View style={locationIconContainer}>
        <LocationPinIcon />
      </View>
      <View style={styles.addressContent}>
        <Typography.Text color="neutralBase+30" size="callout">
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
      {isTemporary && (
        <View style={temporaryTag}>
          <Typography.Text color="primaryBase-40" size="caption2">
            Temporary
          </Typography.Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  addressContent: {
    alignItems: "flex-start",
    flex: 1,
    marginLeft: 12,
  },
  shadow: generateShadow(8),
});
