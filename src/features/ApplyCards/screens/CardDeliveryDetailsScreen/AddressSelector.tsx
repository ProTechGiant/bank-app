import { Pressable, PressableProps, StyleSheet, View, ViewStyle } from "react-native";

import { LocationPinIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface AddressSelectorProps extends Omit<PressableProps, "children" | "style"> {
  id: string;
  addressLineOne: string;
  addressLineTwo?: string;
  addressLineThree?: string;
  isSelected: boolean;
  isTemporary: boolean;
  handlePress: (id: string) => void;
}

const AddressSelector = ({
  id,
  addressLineOne,
  addressLineTwo,
  addressLineThree,
  isSelected,
  isTemporary,
  handlePress,
}: AddressSelectorProps) => {
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["neutralBase-50"],
      borderRadius: theme.radii.extraSmall,
      elevation: 8,
      flexDirection: "row",
      flexShrink: 0,
      padding: theme.spacing.medium,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    }),
    []
  );
  const isSelectedStyle = useThemeStyles<ViewStyle>(
    theme => ({
      borderColor: theme.palette.complimentBase,
      borderWidth: 2,
    }),
    []
  );
  const iconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.locationPin, []);
  const temporaryTag = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["complimentBase-40%"],
      borderRadius: theme.radii.xxlarge,
      height: 21,
      paddingHorizontal: theme.spacing.small,
      paddingVertical: 4,
    }),
    []
  );

  return (
    <Pressable onPress={() => handlePress(id)}>
      <View style={[container, isSelected && isSelectedStyle]}>
        <LocationPinIcon width={iconDimensions} height={iconDimensions} />
        <View style={styles.addressContent}>
          <Typography.Text color="primaryBase+30" size="callout">
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
        </View>
        {isTemporary && (
          <View style={temporaryTag}>
            <Typography.Text color="complimentBase" size="caption2">
              Temporary
            </Typography.Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default AddressSelector;

const styles = StyleSheet.create({
  addressContent: {
    flex: 1,
    marginLeft: 12,
  },
});
