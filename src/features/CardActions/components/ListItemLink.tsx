import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { ChevronRightIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface ListItemLinkProps {
  icon?: React.ReactElement<SvgProps>;
  title: string;
  onPress: () => void;
}

export default function ListItemLink({ icon, title, onPress }: ListItemLinkProps) {
  const containerStyles = useThemeStyles<ViewStyle>(theme => ({
    alignContent: "center",
    flexDirection: "row",
    paddingVertical: theme.spacing["16p"],
    height: 73,
  }));

  const { height: iconHeight, width: iconWidth } = useThemeStyles(theme => theme.iconDimensions.chevronRight);
  const iconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-20"], []);

  return (
    <Pressable style={containerStyles} onPress={onPress}>
      {icon !== undefined && <View style={styles.iconContainer}>{icon}</View>}
      <View style={styles.titleContainer}>
        {title && (
          <Typography.Text size="callout" weight="medium">
            {title}
          </Typography.Text>
        )}
      </View>
      <View style={[styles.arrowContainer, { transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }]}>
        <ChevronRightIcon color={iconColor} height={iconHeight} width={iconWidth} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  arrowContainer: {
    justifyContent: "center",
  },
  iconContainer: {
    justifyContent: "center",
    marginRight: 18,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
