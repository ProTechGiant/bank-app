import { useTranslation } from "react-i18next";
import { Dimensions, Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

import { DiamondIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

export default function UpgradeNow() {
  const { t } = useTranslation();
  const screenWidth = Dimensions.get("window").width;

  const informationContainerViewStyle = useThemeStyles<ViewStyle>(theme => ({
    width: screenWidth - 40,
    padding: theme.spacing["16p"],
    borderRadius: theme.spacing["12p"],
    borderLeftWidth: theme.spacing["4p"],
    borderLeftColor: "#39FDDC",
    backgroundColor: "#EEF6F7",
    alignItems: "flex-start",
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  }));

  const informationTextStyle = useThemeStyles<TextStyle>(theme => ({
    fontSize: theme.typography.text.sizes.caption2,
    color: "#1E1A25",
  }));

  const upgradeContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));
  return (
    <View style={upgradeContainerStyle}>
      <View style={informationContainerViewStyle}>
        <Stack direction="horizontal" gap="4p" align="center">
          <DiamondIcon width={16} height={16} color="#1E1A25" />
          <Text style={informationTextStyle}>
            {t("AllInOneCard.myCurrenciesScreens.save30")}
            <Typography.Text weight="semiBold" size="caption2">
              {t("AllInOneCard.myCurrenciesScreens.neraPlus")}
            </Typography.Text>
          </Text>
        </Stack>
        <Pressable testID="AllInOneCard.MyCurrenciesScreen:PressableUpgradeNow">
          <Text style={[informationTextStyle, styles.textDecorationLine]}>
            {t("AllInOneCard.myCurrenciesScreens.upgrade")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textDecorationLine: {
    color: "#FF523D",
    textDecorationLine: "underline",
  },
});
