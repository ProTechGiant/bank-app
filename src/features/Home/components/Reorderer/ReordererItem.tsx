import { StyleSheet, TouchableOpacity, View } from "react-native";

import { DisabledPlusIcon, HamburgerIcon, MinusIcon, PlusIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { iconDimensions, palette, spacing } from "@/theme/values";

import { useItemListContext } from "../../context/ItemListContext";
interface ItemProps {
  id: string;
  label: string;
  description: string;
  isActive: boolean;
  isReorderAllowed?: boolean;
  isRemoveAllowed?: boolean;
  isAddAllowed?: boolean;
}

interface RenderMinimumNotReachedPlaceholdersProps {
  minActiveSections?: number;
  activeItems?: number;
}

export function RenderMinimumNotReachedPlaceholders({
  minActiveSections,
  activeItems,
}: RenderMinimumNotReachedPlaceholdersProps) {
  if (
    minActiveSections === undefined ||
    activeItems === undefined ||
    minActiveSections <= 0 ||
    minActiveSections - activeItems < 0
  ) {
    return <></>;
  }
  const placeholderBlock = (i: number) => (
    <View style={styles.objectContainerPlaceholder} key={"ReorderItemPlaceholder_" + i}>
      <View style={styles.placeholderTextContainer}>
        <Typography.Text style={styles.placeholderText} color="neutralBase-10" size="callout" weight="medium">
          Select an action from the list below to proceed.
        </Typography.Text>
      </View>
    </View>
  );
  // Return the placeholderBlock as many times as needed
  return <View>{[...Array(minActiveSections - activeItems)].map(i => placeholderBlock(i))}</View>;
}

export default function ReordererItem({
  id,
  label,
  description,
  isReorderAllowed = true,
  isRemoveAllowed = true,
  isAddAllowed = true,
  isActive,
}: ItemProps) {
  const handleToggle = () => {
    if (toggleItem) {
      toggleItem(id);
    }
  };
  const { toggleItem } = useItemListContext();
  return (
    <View style={styles.objectContainer}>
      {isActive && isRemoveAllowed && (
        <TouchableOpacity onPress={handleToggle}>
          <MinusIcon
            style={styles.minusIcon}
            width={iconDimensions.reorderIcons}
            height={iconDimensions.reorderIcons}
          />
        </TouchableOpacity>
      )}
      {(!isActive && isAddAllowed && (
        <TouchableOpacity onPress={handleToggle}>
          <PlusIcon style={styles.plusIcon} width={iconDimensions.reorderIcons} height={iconDimensions.reorderIcons} />
        </TouchableOpacity>
      )) ||
        (!isActive && !isAddAllowed && (
          <TouchableOpacity disabled={true}>
            <DisabledPlusIcon
              style={styles.plusIconDisabled}
              width={iconDimensions.reorderIcons}
              height={iconDimensions.reorderIcons}
            />
          </TouchableOpacity>
        ))}
      {/* If no icons are used then we place a placeholder */}
      {!isRemoveAllowed && isActive && <View style={styles.iconReplacement} />}

      <View style={styles.textContainer}>
        <Typography.Text
          style={styles.label}
          size="callout"
          color={isAddAllowed ? "primaryBase" : "neutralBase-20"}
          weight="medium">
          {label}
        </Typography.Text>
        <Typography.Text
          style={styles.description}
          color={isAddAllowed ? "neutralBase-10" : "neutralBase-20"}
          size="caption1"
          weight="regular">
          {description}
        </Typography.Text>
      </View>
      {isReorderAllowed && <HamburgerIcon style={styles.hamburgerIcon} width="18" height="12.6" />}
    </View>
  );
}

const styles = StyleSheet.create({
  description: {
    flexGrow: 1,
    flexShrink: 1,
    marginBottom: 14,
  },
  hamburgerIcon: { margin: spacing.medium },
  iconReplacement: {
    margin: spacing.medium,
  },
  label: {
    flexGrow: 1,
    flexShrink: 1,
    marginBottom: 4,
    marginTop: 14,
  },
  minusIcon: {
    margin: spacing.medium,
  },
  objectContainer: {
    alignItems: "center",
    backgroundColor: palette["neutralBase-50"],
    flex: 1,
    flexDirection: "row",
    gap: spacing.medium,
    justifyContent: "flex-start",
    marginBottom: spacing.small / 2,
    marginHorizontal: spacing.medium,
    marginTop: spacing.small / 2,
    maxHeight: 100,
  },
  objectContainerPlaceholder: {
    alignItems: "center",
    borderColor: palette["neutralBase+10"],
    borderStyle: "dashed",
    borderWidth: 1,
    gap: spacing.medium,
    height: 81,
    marginBottom: spacing.small / 2,
    marginHorizontal: spacing.medium,
    marginTop: spacing.small / 2,
  },
  placeholderText: {
    textAlign: "center",
  },
  placeholderTextContainer: {
    flexDirection: "column",
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: "center",
    padding: spacing.medium,
  },
  plusIcon: {
    margin: spacing.medium,
  },
  plusIconDisabled: {
    margin: spacing.medium,
  },
  textContainer: {
    flexDirection: "column",
    flexGrow: 1,
    flexShrink: 1,
  },
});
