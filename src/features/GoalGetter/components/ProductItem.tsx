import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, ViewStyle } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

import { useGoalGetterContext } from "../contexts/GoalGetterContext";
import { GoalGetterProduct, ProductTypeName } from "../types";
import { calculateExpectedReturnForYears } from "../utils";

interface ProductItemInterface {
  product: GoalGetterProduct;
  onInfoPress: (productType: string) => void;
}

export default function ProductItem({ product, onInfoPress }: ProductItemInterface) {
  const { t } = useTranslation();

  const { setGoalContextState, ProductId, TargetAmount, Duration } = useGoalGetterContext();

  const profitRateValue = calculateExpectedReturnForYears(
    TargetAmount,
    product.ProfitPercentage,
    Math.round(Duration / 12)
  );

  const timeToAchieve = () => {
    const result = (Duration * TargetAmount) / parseFloat(profitRateValue.replace(/,/g, ""));
    const roundedResult = Math.round(result);
    return roundedResult;
  };

  const productIconLookUp = {
    SAVING_POT: require("../assets/savingPot.png"),
    GOLD: require("../assets/goldproduct.png"),
    LOW_RISK_MUTUAL_FUND: require("../assets/productItem.png"),
    MEDIUM_RISK_MUTUAL_FUND: require("../assets/productItem.png"),
    HIGH_RISK_MUTUAL_FUND: require("../assets/productItem.png"),
  };

  const containerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      borderRadius: theme.radii.small,
      padding: theme.spacing["16p"],
      paddingBottom: theme.spacing["4p"],
      backgroundColor: theme.palette["neutralBase-60"],
      borderWidth: 1,
      borderColor:
        ProductId === product.ProductId ? theme.palette["complimentBase+10"] : theme.palette["neutralBase-10"],
    }),
    [ProductId]
  );

  const textContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "65%",
    borderTopWidth: 1,
    borderColor: theme.palette["neutralBase-10"],
    paddingTop: theme.spacing["8p"],
  }));

  return (
    <Pressable
      onPress={() => {
        setGoalContextState({
          ProductId: product.ProductId,
          ProductType: product.ProductType,
          ProductName: product.ProductName,
          ProductAvailable: product.Available,
        });
      }}>
      <Stack direction="vertical" align="stretch" gap="8p" style={containerStyle}>
        <Stack direction="horizontal" align="center" gap="8p">
          <Typography.Text size="title1" weight="bold">
            {product.ProductName}
          </Typography.Text>
          <Pressable
            onPress={() => {
              onInfoPress(product.ProductType);
              return;
            }}>
            <InfoCircleIcon />
          </Pressable>
        </Stack>
        <Stack direction="horizontal">
          <Stack direction="vertical" gap="4p" flex={1}>
            <Typography.Text size="footnote">{t("GoalGetter.ShapeYourGoalScreen.timeToAchieve")}</Typography.Text>
            <Typography.Text size="title2" weight="bold">
              {t("GoalGetter.ShapeYourGoalScreen.months", {
                value: product.ProductType !== ProductTypeName.SAVING_POT ? timeToAchieve() : Duration,
              })}
            </Typography.Text>
            {product.ProductType !== ProductTypeName.SAVING_POT ? (
              <Typography.Text size="caption1">{t("GoalGetter.ShapeYourGoalScreen.profitRate")}</Typography.Text>
            ) : null}
          </Stack>
          {product.ProductType !== ProductTypeName.SAVING_POT ? (
            <Stack direction="vertical" gap="4p" flex={1}>
              <Typography.Text size="footnote">{t("GoalGetter.ShapeYourGoalScreen.expectedProfit")}</Typography.Text>
              <Typography.Text size="title2" weight="bold">
                {product.ProfitPercentage}
              </Typography.Text>
              <Typography.Text size="caption1">
                {t("GoalGetter.ShapeYourGoalScreen.sar", {
                  value: profitRateValue,
                })}
              </Typography.Text>
            </Stack>
          ) : null}
        </Stack>
        <Stack direction="vertical" style={textContainerStyle}>
          <Typography.Text size="caption2">{t("GoalGetter.ShapeYourGoalScreen.productItemTitle")}</Typography.Text>
        </Stack>
        <Stack direction="vertical" align="center" justify="center" style={styles.imageContainerStyle}>
          <Image source={productIconLookUp[product.ProductType]} />
        </Stack>
      </Stack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  imageContainerStyle: {
    bottom: 0,
    height: 95,
    overflow: "hidden",
    position: "absolute",
    right: 0,
    width: 95,
  },
});
