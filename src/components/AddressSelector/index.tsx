import { Pressable, PressableProps, StyleSheet, View } from "react-native";

import Typography from "@/components/Typography";
import { iconDimensions, palette, radii, spacing } from "@/theme/values";
import { Icons } from "@/assets/icons";

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
  const LocationPinIcon = Icons["LocationPin"];
  const TickOrangeIcon = Icons["TickOrange"];

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
  container: {
    flexDirection: "row",
    flexShrink: 0,
    padding: spacing.medium,
    backgroundColor: palette["neutralBase-50"],
    borderRadius: radii.extraSmall,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  isSelected: {
    borderColor: palette.complimentBase,
    borderWidth: 2,
  },
  addressContent: {
    marginLeft: 12,
    flex: 1,
  },
  tickIcon: {
    width: 18,
    alignItems: "flex-end",
  },
});
