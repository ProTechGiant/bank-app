import { createElement } from "react";
import { useTranslation } from "react-i18next";

import { HideIcon, LockIcon, ShowIcon, UnLockIcon } from "@/assets/icons";
import Stack from "@/components/Stack";

import { CardStatus } from "../types";
import IconButton from "./IconButton";

interface CardButtonsProps {
  isFreezeButtonVisible?: boolean;
  isShowingDetails: boolean;
  isCardFrozen: boolean;
  cardStatus: CardStatus;
  onShowDetailsPress: () => void;
  onFreezePress: () => void;
}

export default function CardButtons({
  isFreezeButtonVisible = true,
  isShowingDetails,
  isCardFrozen,
  cardStatus,
  onShowDetailsPress,
  onFreezePress,
}: CardButtonsProps) {
  const { t } = useTranslation();

  return (
    <Stack direction="horizontal" align="center" justify="center" gap="24p">
      {cardStatus !== "LOCK" ? (
        <IconButton
          active={isShowingDetails}
          activeLabel={t("CardActions.CardDetailsScreen.iconButtonText.hide")}
          inactiveLabel={t("CardActions.CardDetailsScreen.iconButtonText.show")}
          onPress={onShowDetailsPress}
          icon={createElement(isShowingDetails ? HideIcon : ShowIcon, { height: 24, width: 24 })}
          testID="CardActions.CardDetailsScreen:CardShowDetailsButton"
        />
      ) : null}
      {isFreezeButtonVisible ? (
        <IconButton
          active={isCardFrozen}
          onPress={onFreezePress}
          icon={cardStatus === "LOCK" ? <UnLockIcon /> : <LockIcon />}
          activeLabel={t("CardActions.CardDetailsScreen.iconButtonText.unfreeze")}
          inactiveLabel={t("CardActions.CardDetailsScreen.iconButtonText.freeze")}
          testID="CardActions.CardDetailsScreen:CardFreezeUnfreezeButton"
        />
      ) : null}
    </Stack>
  );
}
