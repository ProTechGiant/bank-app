import { Pressable, PressableProps, StyleSheet, View, ViewStyle } from "react-native";

import { LocationPinIcon, TickOrangeIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface AddressSelectorProps extends Omit<PressableProps, "children" | "style"> {
  id: string;
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  isSelected: boolean;
  handlePress: (id: string) => void;
}

const AddressSelector = ({
  id,
  addressLine1,
  addressLine2,
  addressLine3,
  isSelected,
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

  return (
    <Pressable onPress={() => handlePress(id)}>
      <View style={[container, isSelected && isSelectedStyle]}>
        <LocationPinIcon width={iconDimensions} height={iconDimensions} />
        <View style={styles.addressContent}>
          <Typography.Text color="primaryBase+30" size="callout">
            {addressLine1}
          </Typography.Text>
          <Typography.Text color="neutralBase-10" size="footnote">
            {addressLine2}
          </Typography.Text>
          <Typography.Text color="neutralBase-10" size="footnote">
            {addressLine3}
          </Typography.Text>
        </View>
        <View style={styles.tickIcon}>{isSelected && <TickOrangeIcon width={18} height={14} />}</View>
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
  tickIcon: {
    alignItems: "flex-end",
    width: 18,
  },
});
