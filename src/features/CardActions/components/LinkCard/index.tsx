import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { ChevronRightIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface LinkCardProps {
  icon?: React.ReactElement<SvgProps>;
  title: string;
  onPress: () => void;
}

export default function LinkCard({ icon, title, onPress }: LinkCardProps) {
  const container = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["24p"],
    flexDirection: "row",
  }));

  const { height: iconHeight, width: iconWidth } = useThemeStyles(theme => theme.iconDimensions.chevronRight);
  const iconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-20"], []);

  return (
    <Pressable style={container} onPress={onPress}>
      {icon !== undefined && <View style={styles.iconContainer}>{icon}</View>}
      <View style={{ flex: 1 }}>
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
    alignContent: "center",
    marginRight: 18,
  },
});
