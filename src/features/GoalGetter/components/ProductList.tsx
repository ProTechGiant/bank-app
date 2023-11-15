import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useGoalGetterContext } from "../contexts/GoalGetterContext";
import { GoalGetterProduct, ProductTypeName } from "../types";
import GoalSetupIllustration from "./GoalSetupIllustration";
import GoalSetupLineChartModal from "./GoalSetupLineChartModal";
import GoalSetupPieChartModal from "./GoalSetupPieChartModal";
import ProductItem from "./ProductItem";

interface ProductListInterface {
  productList: GoalGetterProduct[] | undefined;
}

export default function ProductList({ productList }: ProductListInterface) {
  const { t } = useTranslation();
  const { ProductId, ProductType } = useGoalGetterContext();
  const navigation = useNavigation();

  const [isSetupIllustrationVisible, setSetupIllustrationVisible] = useState(false);
  const [isSetupLineChartVisible, setSetupLineChartVisible] = useState(false);
  const [isSetupPieChartVisible, setSetupPieChartVisible] = useState(false);

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({ padding: theme.spacing["20p"], paddingBottom: 100 }));

  function navigateToScreen(productType: string): void {
    switch (productType) {
      case ProductTypeName.SAVING_POT:
        navigation.navigate("GoalGetter.ContributionSavingPotScreen");
        break;
      case ProductTypeName.GOLD:
        navigation.navigate("GoalGetter.SetGoldContributionScreen");
        break;
      case ProductTypeName.LOW_RISK_MUTUAL_FUND:
        navigation.navigate("GoalGetter.ContributionScreen");
        break;
      case ProductTypeName.MEDIUM_RISK_MUTUAL_FUND:
        navigation.navigate("GoalGetter.ContributionScreen");

        break;
      case ProductTypeName.HIGH_RISK_MUTUAL_FUND:
        navigation.navigate("GoalGetter.ContributionScreen");
        break;
      default:
        break;
    }
  }

  function navigateToModal(productType: string): void {
    switch (productType) {
      case ProductTypeName.SAVING_POT:
        setSetupIllustrationVisible(true);
        break;
      case ProductTypeName.GOLD:
        setSetupLineChartVisible(true);
        break;
      case ProductTypeName.LOW_RISK_MUTUAL_FUND:
        setSetupPieChartVisible(true);
        break;
      case ProductTypeName.MEDIUM_RISK_MUTUAL_FUND:
        setSetupPieChartVisible(true);
        break;
      case ProductTypeName.HIGH_RISK_MUTUAL_FUND:
        setSetupPieChartVisible(true);
        break;
      default:
        break;
    }
  }

  return (
    <Stack direction="vertical" align="stretch" gap="24p" style={containerStyle}>
      <Typography.Text size="title3" color="neutralBase+30" weight="bold">
        {t("GoalGetter.ShapeYourGoalScreen.productsTitle")}
      </Typography.Text>
      <Stack direction="vertical" align="stretch" gap="16p">
        {productList?.map(product => (
          <ProductItem product={product} onInfoPress={navigateToModal} productsLength={productList.length} />
        ))}
      </Stack>
      <Button
        onPress={() => {
          navigateToScreen(ProductType);
          return;
        }}
        disabled={!ProductId}>
        {t("GoalGetter.ShapeYourGoalScreen.continue")}
      </Button>
      <GoalSetupIllustration
        isVisible={isSetupIllustrationVisible}
        onClose={() => setSetupIllustrationVisible(false)}
      />
      <GoalSetupLineChartModal isVisible={isSetupLineChartVisible} onClose={() => setSetupLineChartVisible(false)} />
      <GoalSetupPieChartModal isVisible={isSetupPieChartVisible} onClose={() => setSetupPieChartVisible(false)} />
    </Stack>
  );
}
