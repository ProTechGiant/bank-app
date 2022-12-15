import { Icons } from "@/assets/icons";
import { useItemListContext } from "@/contexts/ItemListContext";
import { iconDimensions, palette, spacing } from "@/theme/values";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Typography from "../Typography";

interface ItemProps {
  id: string;
  label: string;
  description: string;
  isActive: boolean;
  isReorderAllowed?: boolean;
}

interface RenderMinimumNotReachedPlaceholdersProps {
  minActiveSections?: number;
  activeItems?: number;
}

export function RenderMinimumNotReachedPlaceholders({
  minActiveSections,
  activeItems,
}: RenderMinimumNotReachedPlaceholdersProps) {
  if (minActiveSections === undefined || activeItems === undefined || minActiveSections <= 0) {
    return <></>;
  }
  const placeholderBlock = (
    <View style={styles.objectContainerPlaceholder}>
      <View style={styles.placeholderTextContainer}>
        <Typography.Text style={styles.placeholderText} color="neutralBase-10" size="callout" weight="medium">
          Select an action from the list below to proceed.
        </Typography.Text>
      </View>
    </View>
  );
  // Return the placeholderBlock as many times as needed
  return <View>{[...Array(minActiveSections - activeItems)].map(() => placeholderBlock)}</View>;
}

export default function ReordererItem({ id, label, description, isReorderAllowed, isActive }: ItemProps) {
  const handleToggle = () => {
    if (toggleItem) {
      toggleItem(id);
    }
  };
  const { toggleItem } = useItemListContext();
  return (
    <View style={styles.objectContainer}>
      {isActive && (
        <TouchableOpacity onPress={handleToggle}>
          <Icons.Minus
            style={styles.minusIcon}
            width={iconDimensions.reorderIcons}
            height={iconDimensions.reorderIcons}
          />
        </TouchableOpacity>
      )}
      {!isActive && (
        <TouchableOpacity onPress={handleToggle}>
          <Icons.Plus
            style={styles.plusIcon}
            width={iconDimensions.reorderIcons}
            height={iconDimensions.reorderIcons}
          />
        </TouchableOpacity>
      )}
      <View style={styles.textContainer}>
        <Typography.Text style={styles.label} size="callout" color="primaryBase" weight="medium">
          {label}
        </Typography.Text>
        <Typography.Text style={styles.description} color="neutralBase-10" size="caption1" weight="regular">
          {description}
        </Typography.Text>
      </View>
      {isReorderAllowed && <Icons.Hamburger style={styles.hamburgerIcon} width="18" height="12.6" />}
    </View>
  );
}

const styles = StyleSheet.create({
  objectContainer: {
    backgroundColor: palette["neutralBase-50"],
    gap: spacing.medium,
    marginBottom: spacing.medium,
    marginHorizontal: spacing.medium,
    marginTop: spacing.medium,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    maxHeight: 100,
  },
  objectContainerPlaceholder: {
    height: 81,
    backgroundColor: palette["neutralBase-50"],
    gap: spacing.medium,
    marginBottom: spacing.medium,
    marginHorizontal: spacing.medium,
    marginTop: spacing.medium,
    alignItems: "center",
    borderColor: palette["neutralBase+10"],
    borderWidth: 1,
    borderStyle: "dashed",
  },
  minusIcon: {
    margin: spacing.medium,
  },
  plusIcon: {
    margin: spacing.medium,
  },
  hamburgerIcon: { margin: spacing.medium },
  textContainer: {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: "column",
  },
  placeholderTextContainer: {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: "column",
    justifyContent: "center",
    padding: spacing.medium,
  },
  placeholderText: {
    textAlign: "center",
  },
  label: {
    flexGrow: 1,
    flexShrink: 1,
    marginTop: 14,
    marginBottom: 4,
  },
  description: {
    flexGrow: 1,
    flexShrink: 1,
    marginBottom: 14,
  },
});
