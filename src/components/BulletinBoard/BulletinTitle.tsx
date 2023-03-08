import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { AngleDownIcon, AngleUpIcon, BellIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface BulletinTitleProps {
  title: string;
  dropdownVisible?: boolean;
  onPress: () => void;
}

export default function BulletinTitle({ title, dropdownVisible, onPress }: BulletinTitleProps) {
  const titleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-50"],
    borderRadius: theme.radii.extraSmall,
    flexDirection: "row",
    padding: theme.spacing["16p"],
    shadowColor: theme.palette["neutralBase+30"],
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.14,
    elevation: 5,
  }));

  const iconColor = useThemeStyles(theme => theme.palette.complimentBase);

  return (
    <Pressable onPress={onPress} style={titleContainerStyle}>
      <View style={styles.titleWrapper}>
        <View style={styles.subRow}>
          <BellIcon color={iconColor} />
          <View style={{ paddingLeft: 2 }}>
            <Typography.Text color="primaryBase" size="callout" weight="semiBold">
              {title}
            </Typography.Text>
          </View>
        </View>
        {dropdownVisible ? <AngleUpIcon color={iconColor} /> : <AngleDownIcon color={iconColor} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  subRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  titleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
