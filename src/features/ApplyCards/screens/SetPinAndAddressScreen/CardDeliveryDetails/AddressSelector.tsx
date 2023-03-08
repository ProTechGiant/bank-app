import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { LocationPinIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

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
    elevation: 8,
    flexDirection: "row",
    padding: theme.spacing["16p"],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  }));

  const isSelectedStyle = useThemeStyles<ViewStyle>(theme => ({
    borderColor: theme.palette.complimentBase,
    borderWidth: 2,
  }));

  const iconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.locationPin, []);

  const temporaryTag = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["primaryBase-40"],
    borderRadius: theme.radii.xxlarge,
    height: 21,
    paddingHorizontal: theme.spacing["8p"],
    paddingVertical: theme.spacing["4p"],
  }));

  return (
    <Pressable onPress={() => onPress(id)} style={[containerStyle, isSelected && isSelectedStyle]}>
      <LocationPinIcon width={iconDimensions} height={iconDimensions} />
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
          <Typography.Text color="complimentBase" size="caption2">
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
});
