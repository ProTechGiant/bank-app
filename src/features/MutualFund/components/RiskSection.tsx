import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

import BrandShapeVerticalIcon from "@/assets/icons/BrandShapeVerticalIcon";
import { Stack, Typography } from "@/components";
import { SelectPortfolioIcon, UnSelectPortfolioIcon } from "@/features/MutualFund/assets/icons";
import { useThemeStyles } from "@/theme";

interface RiskSectionProps {
  title: string;
  subTitle?: string;
  color: string;
  icon: React.ReactElement;
  onSelect: () => void;
  isSelected: boolean;
}

export default function RiskSection({ title, subTitle, color, icon, onSelect, isSelected }: RiskSectionProps) {
  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.medium,
    flex: 1,
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-40"],
  }));

  const backgroundStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: color,
    flex: 1.2,
    borderTopStartRadius: theme.radii.medium,
    borderBottomStartRadius: theme.radii.medium,
  }));

  const ImageContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderTopStartRadius: theme.radii.medium,
    borderBottomStartRadius: theme.radii.medium,
    flexDirection: "row",
    flex: 1,
  }));

  const ContentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 2.5,
    justifyContent: "center",
    height: "100%",
    marginHorizontal: theme.spacing["16p"],
  }));

  const subTitleTextStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["8p"],
  }));

  const paddingTopValue = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["32p"],
  }));

  return (
    <TouchableOpacity onPress={onSelect} style={styles.flex2}>
      <Stack direction="horizontal" style={contentStyle}>
        <View style={ImageContainerStyle}>
          <View style={backgroundStyle} />
          <View style={styles.dividerStyle}>
            <BrandShapeVerticalIcon color={color} height="100%" />
          </View>
          <View style={styles.iconStyle}>{icon}</View>
        </View>
        <View style={ContentContainerStyle}>
          <View style={styles.rowCenter}>
            <View>
              <Typography.Text size="body" color="neutralBase+30" weight="bold" numberOfLines={2}>
                {title}
              </Typography.Text>
              <Typography.Text size="caption1" color="neutralBase+10" style={subTitleTextStyle} numberOfLines={4}>
                {subTitle}
              </Typography.Text>
            </View>
            <View style={paddingTopValue}>{isSelected ? <SelectPortfolioIcon /> : <UnSelectPortfolioIcon />}</View>
          </View>
        </View>
      </Stack>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  dividerStyle: {
    start: -13,
  },
  flex2: {
    flex: 2,
  },
  iconStyle: {
    left: 37,
    position: "absolute",
    top: 45,
  },
  rowCenter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
