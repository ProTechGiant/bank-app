import { useTranslation } from "react-i18next";
import { I18nManager, Image, ImageSourcePropType, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import AldreesIcon from "../assets/AldreesIcon.png";
import { RightIcon } from "../assets/icons";
import StarBucksIcon from "../assets/StarBucksIcon.png";
import ZaraIcon from "../assets/ZaraIcon.png";

interface LatestGoalTransactionProps {
  onPress?: () => void;
  title: string;
  subTitle: string;
  amount: string;
  status?: string;
  paymentType: string;
}

const iconsMap = new Map<string, ImageSourcePropType>([
  ["Starbucks", StarBucksIcon],
  ["Zara", ZaraIcon],
  ["Aldrees", AldreesIcon],
]);

export default function TransactionSectionItem({
  title,
  subTitle,
  onPress,
  amount,
  paymentType,
}: LatestGoalTransactionProps) {
  const { t } = useTranslation();

  const itemStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
  }));

  return (
    <Pressable onPress={onPress}>
      <Stack direction="horizontal" gap="12p" align="center" justify="space-between" style={itemStyle}>
        {/* TODO: replace icons as per the api when available  */}
        <Image resizeMode="contain" source={iconsMap.get(title) ?? StarBucksIcon} />
        <Stack direction="vertical" style={styles.expandText}>
          <Typography.Text size="callout" color="neutralBase+30">
            {title}
          </Typography.Text>
          {paymentType ? (
            <Typography.Text size="footnote" color="neutralBase">
              {paymentType}
            </Typography.Text>
          ) : null}
        </Stack>
        <View style={styles.containerFormatStyle}>
          <Typography.Text>
            <Typography.Text>
              <Typography.Text size="footnote" weight="bold" color="neutralBase+30">
                {amount.split(".")[0]}
                <Typography.Text size="caption1" weight="regular" color="neutralBase+20">
                  {`.${amount.split(".")[1]}`}
                </Typography.Text>
                <Typography.Text size="caption1" weight="regular" color="neutralBase+20">
                  {` ${t("AllInOneCard.Dashboard.sar")}`}
                </Typography.Text>
              </Typography.Text>
            </Typography.Text>
          </Typography.Text>
          <Typography.Text size="caption1" color="neutralBase">
            {subTitle}
          </Typography.Text>
        </View>
        <View style={styles.icon}>
          <RightIcon />
        </View>
      </Stack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  containerFormatStyle: {
    alignItems: "flex-end",
    flexDirection: "column",
  },
  expandText: {
    flex: 1,
  },
  icon: {
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
});
