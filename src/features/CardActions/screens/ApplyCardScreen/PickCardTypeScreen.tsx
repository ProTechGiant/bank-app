import { useTranslation } from "react-i18next";
import { TextStyle } from "react-native";

import NavHeader from "@/components/NavHeader";
import Typography from "@/components/Typography";
import { LUX_CARD_PRODUCT_ID, STANDARD_CARD_PRODUCT_ID } from "@/constants";
import { useThemeStyles } from "@/theme";

import { SelectStandardCard } from "../../components";
import { useApplyCardsContext } from "../../context/ApplyCardsContext";

interface PickCardTypeScreenProps {
  onCancel: () => void;
  onSelected: () => void;
  isLoadingOnSelection?: boolean;
  variant: "apply" | "renew" | "order";
  testID: string;
}

export default function PickCardTypeScreen({
  onCancel,
  onSelected,
  isLoadingOnSelection = false,
  variant,
  testID,
}: PickCardTypeScreenProps) {
  const { t } = useTranslation();

  const applyCardsContext = useApplyCardsContext();

  const handleOnCardPress = (productId: typeof STANDARD_CARD_PRODUCT_ID | typeof LUX_CARD_PRODUCT_ID) => {
    applyCardsContext.setValue("CardProductId", productId);
    onSelected();
  };

  const titleLabelStyle = useThemeStyles<TextStyle>(theme => ({
    margin: theme.spacing["32p"],
  }));

  return (
    <>
      {variant !== "order" ? (
        <NavHeader
          title={
            variant === "apply"
              ? t("CardActions.ApplyCardScreen.PickCardTypeScreen.navTitle")
              : t("CardActions.ApplyCardScreen.CardRenewalScreen.title")
          }
          end={<NavHeader.CloseEndButton onPress={onCancel} />}
          onBackPress={onCancel}
          testID={`${testID}:NavHeader`}
        />
      ) : (
        <Typography.Text style={titleLabelStyle} color="neutralBase+30" weight="semiBold" size="title1">
          {t("CardActions.ApplyCardScreen.PickCardTypeScreen.navTitle")}
        </Typography.Text>
      )}
      <SelectStandardCard
        onPress={() => handleOnCardPress(STANDARD_CARD_PRODUCT_ID)}
        title={
          variant === "apply"
            ? t("CardActions.ApplyCardScreen.PickCardTypeScreen.standard.button")
            : variant === "order"
            ? t("CardActions.ApplyCardScreen.PickCardTypeScreen.navTitle")
            : t("CardActions.ApplyCardScreen.CardRenewalScreen.title")
        }
        isLoadingOnPress={isLoadingOnSelection}
        testID={testID}
      />
    </>
  );
}
