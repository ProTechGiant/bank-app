import { StyleSheet, View, ViewStyle } from "react-native";

import IconGenerator from "@/components/IconGenerator";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export interface TopCategoryItemProps {
  name: string;
  percent: string;
  totalAmount: number;
  currency: string;
  iconPath: string;
  iconViewBox: string;
}

export default function TopCategoryItem({
  name,
  percent,
  totalAmount,
  currency,
  iconPath,
  iconViewBox,
}: TopCategoryItemProps) {
  const iconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: theme.spacing["12p"],
    backgroundColor: theme.palette["supportBase-10"],
    borderRadius: 50,
  }));
  const iconColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);

  return (
    <Stack direction="horizontal" gap="12p" style={styles.alignStyle}>
      <View style={iconContainerStyle}>
        <IconGenerator
          width={22}
          height={22}
          path={iconPath?.replace('d="', "").replace('"', "")}
          color={iconColor}
          viewBox={iconViewBox}
        />
      </View>
      <Stack direction="vertical">
        <Typography.Text color="neutralBase+30" size="callout" weight="regular">
          {name}
        </Typography.Text>
        <Typography.Text color="neutralBase" size="footnote" weight="regular">
          {percent}
        </Typography.Text>
      </Stack>
      <View style={styles.moneyContainer}>
        <Typography.Text color="neutralBase+30" size="callout" weight="regular">
          {totalAmount} {currency}
        </Typography.Text>
      </View>
    </Stack>
  );
}

const styles = StyleSheet.create({
  alignStyle: {
    alignItems: "center",
  },
  moneyContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
