import { Pressable, PressableProps, StyleSheet, View } from "react-native";

import { LocationPinIcon, TickOrangeIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { iconDimensions, palette, radii, spacing } from "@/theme/values";

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
  return (
    <Pressable onPress={() => handlePress(id)}>
      <View style={[styles.container, isSelected && styles.isSelected]}>
        <LocationPinIcon width={iconDimensions.locationPin} height={iconDimensions.locationPin} />
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
  container: {
    backgroundColor: palette["neutralBase-50"],
    borderRadius: radii.extraSmall,
    elevation: 8,
    flexDirection: "row",
    flexShrink: 0,
    padding: spacing.medium,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  isSelected: {
    borderColor: palette.complimentBase,
    borderWidth: 2,
  },
  tickIcon: {
    alignItems: "flex-end",
    width: 18,
  },
});
