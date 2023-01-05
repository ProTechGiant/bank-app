import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

import { DisabledPlusIcon, HamburgerIcon, MinusIcon, PlusIcon } from "@/assets/icons";
import Typography from "@/components/Typography";

import { useItemListContext } from "../../context/ItemListContext";
import { useThemeStyles } from "@/theme";
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
  const objectContainerPlaceholderStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      borderColor: theme.palette["neutralBase+10"],
      borderStyle: "dashed",
      borderWidth: 1,
      gap: theme.spacing.medium,
      height: 81,
      marginBottom: theme.spacing.small / 2,
      marginHorizontal: theme.spacing.medium,
      marginTop: theme.spacing.small / 2,
    }),
    []
  );
  const placeholderTextContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      flexDirection: "column",
      flexGrow: 1,
      flexShrink: 1,
      justifyContent: "center",
      padding: theme.spacing.medium,
    }),
    []
  );

  if (
    minActiveSections === undefined ||
    activeItems === undefined ||
    minActiveSections <= 0 ||
    minActiveSections - activeItems < 0
  ) {
    return <></>;
  }
  const placeholderBlock = (i: number) => (
    <View style={objectContainerPlaceholderStyle} key={"ReorderItemPlaceholder_" + i}>
      <View style={placeholderTextContainerStyle}>
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
  const iconStyle = useThemeStyles<ViewStyle>(
    theme => ({
      margin: theme.spacing.medium,
    }),
    []
  );
  const objectContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      backgroundColor: theme.palette["neutralBase-50"],
      flex: 1,
      flexDirection: "row",
      gap: theme.spacing.medium,
      justifyContent: "flex-start",
      marginBottom: theme.spacing.small / 2,
      marginHorizontal: theme.spacing.medium,
      marginTop: theme.spacing.small / 2,
      maxHeight: 100,
    }),
    []
  );

  const iconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.reorderIcons, []);

  const handleToggle = () => {
    if (toggleItem) {
      toggleItem(id);
    }
  };
  const { toggleItem } = useItemListContext();
  return (
    <View style={objectContainerStyle}>
      {isActive && isRemoveAllowed && (
        <TouchableOpacity onPress={handleToggle}>
          <MinusIcon style={iconStyle} width={iconDimensions} height={iconDimensions} />
        </TouchableOpacity>
      )}
      {(!isActive && isAddAllowed && (
        <TouchableOpacity onPress={handleToggle}>
          <PlusIcon style={iconStyle} width={iconDimensions} height={iconDimensions} />
        </TouchableOpacity>
      )) ||
        (!isActive && !isAddAllowed && (
          <TouchableOpacity disabled={true}>
            <DisabledPlusIcon style={iconStyle} width={iconDimensions} height={iconDimensions} />
          </TouchableOpacity>
        ))}
      {/* If no icons are used then we place a placeholder */}
      {!isRemoveAllowed && isActive && <View style={iconStyle} />}

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
      {isReorderAllowed && <HamburgerIcon style={iconStyle} width="18" height="12.6" />}
    </View>
  );
}

const styles = StyleSheet.create({
  description: {
    flexGrow: 1,
    flexShrink: 1,
    marginBottom: 14,
  },
  label: {
    flexGrow: 1,
    flexShrink: 1,
    marginBottom: 4,
    marginTop: 14,
  },
  placeholderText: {
    textAlign: "center",
  },
  textContainer: {
    flexDirection: "column",
    flexGrow: 1,
    flexShrink: 1,
  },
});
