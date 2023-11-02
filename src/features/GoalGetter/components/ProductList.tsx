import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import { useThemeStyles } from "@/theme";

import ProductItem from "./ProductItem";

export default function ProductList() {
  const { t } = useTranslation();
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({ padding: theme.spacing["20p"], paddingBottom: 100 }));

  return (
    <Stack direction="vertical" align="stretch" gap="24p" style={containerStyle}>
      <Typography.Text size="title3" color="neutralBase+30" weight="bold">
        {t("GoalGetter.ShapeYourGoalScreen.productsTitle")}
      </Typography.Text>
      <Stack direction="vertical" align="stretch" gap="16p">
        <ProductItem />
        <ProductItem />
        <ProductItem />
      </Stack>
      {/* TODO: add navigation */}
      <Button
        onPress={() => {
          return;
        }}
        disabled>
        {t("GoalGetter.ShapeYourGoalScreen.continue")}
      </Button>
    </Stack>
  );
}
