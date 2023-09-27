import { createElement } from "react";
import { useTranslation } from "react-i18next";

import { HideIcon, LockIcon, PinIcon, ShowIcon, UnLockIcon } from "@/assets/icons";
import Stack from "@/components/Stack";

import { CardStatus } from "../types";
import IconButton from "./IconButton";

interface CardButtonsProps {
  isFreezeButtonVisible?: boolean;
  isViewPinButtonVisible?: boolean;
  isShowingDetails: boolean;
  isCardFrozen: boolean;
  isViewingPin: boolean;
  isDisablePin: boolean;
  cardStatus: CardStatus;
  onShowDetailsPress: () => void;
  onFreezePress: () => void;
  onViewPinPress: () => void;
}

export default function CardButtons({
  isFreezeButtonVisible = true,
  isViewPinButtonVisible = true,
  isShowingDetails,
  isCardFrozen,
  isViewingPin,
  isDisablePin,
  cardStatus,
  onShowDetailsPress,
  onFreezePress,
  onViewPinPress,
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
        />
      ) : null}
      {isFreezeButtonVisible ? (
        <IconButton
          changeBackgroundColor={false}
          active={isCardFrozen}
          onPress={onFreezePress}
          icon={cardStatus === "LOCK" ? <UnLockIcon /> : <LockIcon />}
          activeLabel={t("CardActions.CardDetailsScreen.iconButtonText.unfreeze")}
          inactiveLabel={t("CardActions.CardDetailsScreen.iconButtonText.freeze")}
        />
      ) : null}
      {isViewPinButtonVisible ? (
        <IconButton
          active={isViewingPin}
          onPress={onViewPinPress}
          activeLabel={t("CardActions.CardDetailsScreen.iconButtonText.viewPin")}
          inactiveLabel={t("CardActions.CardDetailsScreen.iconButtonText.viewPin")}
          icon={<PinIcon />}
          disabled={isDisablePin}
        />
      ) : null}
    </Stack>
  );
}
