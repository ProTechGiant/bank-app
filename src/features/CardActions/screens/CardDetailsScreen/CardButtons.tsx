import { createElement } from "react";
import { useTranslation } from "react-i18next";

import { FreezeIcon, HideIcon, LockIcon, ShowIcon } from "@/assets/icons";
import Stack from "@/components/Stack";

import IconButton from "./IconButton";

interface CardButtonsProps {
  isShowingDetails: boolean;
  isCardFrozen: boolean;
  isViewingPin: boolean;
  onShowDetailsPress: () => void;
  onFreezePress: () => void;
  onViewPinPress: () => void;
}

export default function CardButtons({
  isShowingDetails,
  isCardFrozen,
  isViewingPin,
  onShowDetailsPress,
  onFreezePress,
  onViewPinPress,
}: CardButtonsProps) {
  const { t } = useTranslation();

  return (
    <Stack direction="horizontal" justify="space-around">
      <IconButton
        active={isShowingDetails}
        activeLabel={t("CardActions.CardDetailsScreen.iconButtonText.hide")}
        inactiveLabel={t("CardActions.CardDetailsScreen.iconButtonText.show")}
        onPress={onShowDetailsPress}
        icon={createElement(isShowingDetails ? HideIcon : ShowIcon, { height: 24, width: 24 })}
      />
      <IconButton
        active={isCardFrozen}
        onPress={onFreezePress}
        icon={<FreezeIcon />}
        activeLabel={t("CardActions.CardDetailsScreen.iconButtonText.unfreeze")}
        inactiveLabel={t("CardActions.CardDetailsScreen.iconButtonText.freeze")}
      />
      <IconButton
        active={isViewingPin}
        onPress={onViewPinPress}
        activeLabel={t("CardActions.CardDetailsScreen.iconButtonText.viewPin")}
        inactiveLabel={t("CardActions.CardDetailsScreen.iconButtonText.viewPin")}
        icon={<LockIcon />}
      />
    </Stack>
  );
}
