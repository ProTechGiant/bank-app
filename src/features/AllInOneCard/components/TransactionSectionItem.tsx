import { useTranslation } from "react-i18next";
import { I18nManager, Image, ImageSourcePropType, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { RightIcon } from "../assets/icons";
import { SafewayMarketIcon, ShoppingIcon, TopUpIcon, ZaraIcon } from "../assets/images";

interface LatestGoalTransactionProps {
  id: string;
  onPress?: () => void;
  MerchantName: string;
  TransactionDate: string;
  amount: string;
  TransactionType: string;
}

const iconsMap = new Map<string, ImageSourcePropType>([
  ["Whole Foods Market", ShoppingIcon],
  ["Zara", ZaraIcon],
  ["Top-Up", TopUpIcon],
  ["Miles Shopping Center", ShoppingIcon],
  ["Safeway Market", SafewayMarketIcon],
]);

export default function TransactionSectionItem({
  id,
  MerchantName,
  TransactionDate,
  onPress,
  amount,
  TransactionType,
}: LatestGoalTransactionProps) {
  const { t } = useTranslation();
  const formattedPrice = parseFloat(amount).toFixed(2);

  const itemStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
  }));

  return (
    <Pressable onPress={onPress} testID="AllInOneCard.AllTransactionScreen:PressableSectionItem">
      <Stack direction="horizontal" gap="12p" align="center" justify="space-between" style={itemStyle}>
        {/* TODO: replace icons as per the api when available  */}
        <Image resizeMode="contain" source={iconsMap.get(MerchantName) ?? ShoppingIcon} />
        <Stack direction="vertical" style={styles.expandText}>
          <Typography.Text
            size="callout"
            color="neutralBase+30"
            weight="medium"
            testID={`AllInOneCard.CurrencyTransactionDetail:${id}-MerchantName`}>
            {MerchantName}
          </Typography.Text>
          {TransactionDate ? (
            <Typography.Text size="footnote" color="neutralBase">
              {TransactionDate}
            </Typography.Text>
          ) : null}
        </Stack>
        <View style={styles.containerFormatStyle}>
          {Number(amount) < 0 ? (
            <>
              <Typography.Text>
                <Typography.Text>
                  <Typography.Text size="callout" weight="bold" color="neutralBase+30">
                    {formattedPrice.split(".")[0]}
                    <Typography.Text size="footnote" weight="regular" color="neutralBase+30">
                      {`.${formattedPrice.split(".")[1]}`}
                    </Typography.Text>
                    <Typography.Text size="callout" weight="regular" color="neutralBase+30">
                      {` ${t("AllInOneCard.Dashboard.sar")}`}
                    </Typography.Text>
                  </Typography.Text>
                </Typography.Text>
              </Typography.Text>
              <Typography.Text size="caption1" color="primaryBase-30">
                {TransactionType}
              </Typography.Text>
            </>
          ) : (
            <Typography.Text>
              <Typography.Text>
                <Typography.Text size="callout" weight="bold" color="primaryBase-30">
                  {formattedPrice.split(".")[0]}
                  <Typography.Text size="footnote" weight="regular" color="primaryBase-30">
                    {`.${formattedPrice.split(".")[1]}`}
                  </Typography.Text>
                  <Typography.Text size="callout" weight="regular" color="primaryBase-30">
                    {` ${t("AllInOneCard.Dashboard.sar")}`}
                  </Typography.Text>
                </Typography.Text>
              </Typography.Text>
            </Typography.Text>
          )}
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
