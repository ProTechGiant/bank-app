import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import RequestIcon from "../assets/icons/RequestIcon";
import { FILTER_COLOR_MAPPING, FilterTypeEnum } from "../type";

interface RequestParams {
  username: string;
  date: string;
  value: number;
  status: FilterTypeEnum;
  onPress: () => void;
}
export default function Request({ username, date, value, status, onPress }: RequestParams) {
  const { t } = useTranslation();

  const iconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.xxlarge,
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    backgroundColor: "white",
    padding: theme.spacing["8p"],
  }));
  const chevronIconColor = useThemeStyles(theme => theme.palette["neutralBase-20"]);
  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["8p"],
    width: "100%",
  }));

  return (
    <Pressable onPress={onPress} style={contentContainerStyle}>
      <Stack direction="horizontal" gap="16p" align="center">
        <View style={iconContainerStyle}>
          <RequestIcon />
        </View>

        <Stack direction="vertical">
          <Typography.Text size="callout">{username}</Typography.Text>
          <Typography.Text size="caption1" color="neutralBase">
            {date}
          </Typography.Text>
        </Stack>

        <Stack direction="vertical" style={styles.fullMarginLeft}>
          <Typography.Text size="callout">{formatCurrency(value, "SAR")}</Typography.Text>
          <Typography.Text size="caption1" color={FILTER_COLOR_MAPPING[status]} align="center" style={styles.alignEnd}>
            {t(`Ips.HubScreen.${status}`)}
          </Typography.Text>
        </Stack>

        <ChevronRightIcon color={chevronIconColor} />
      </Stack>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  alignEnd: {
    alignSelf: "flex-end",
  },
  fullMarginLeft: {
    marginLeft: "auto",
  },
});
