import { createElement, useState } from "react";
import { useTranslation } from "react-i18next";

import { FreezeIcon, HideIcon, LockIcon, ShowIcon } from "@/assets/icons";
import Stack from "@/components/Stack";

import IconButton from "./IconButton";

interface CardIconButtonsProps {
  showDetails: boolean;
  onPressShowDetails: () => void;
}

export default function CardIconButtons({ showDetails, onPressShowDetails }: CardIconButtonsProps) {
  const { t } = useTranslation();

  const [freeze, setFreeze] = useState(false);
  const [viewPin, setViewPin] = useState(false);

  const handleOnPressFreeze = () => {
    setFreeze(!freeze);
  };

  const handleOnPressViewPin = () => {
    setViewPin(!viewPin);
  };

  return (
    <Stack direction="horizontal" justify="space-around">
      <IconButton
        active={showDetails}
        activeLabel={t("CardActions.CardDetailsScreen.iconButtonText.hide")}
        inactiveLabel={t("CardActions.CardDetailsScreen.iconButtonText.show")}
        onPress={onPressShowDetails}
        icon={createElement(showDetails ? HideIcon : ShowIcon, { height: 24, width: 24 })}
      />
      <IconButton
        active={freeze}
        onPress={handleOnPressFreeze}
        icon={<FreezeIcon />}
        activeLabel={t("CardActions.CardDetailsScreen.iconButtonText.unfreeze")}
        inactiveLabel={t("CardActions.CardDetailsScreen.iconButtonText.freeze")}
      />
      <IconButton
        active={viewPin}
        onPress={handleOnPressViewPin}
        activeLabel={t("CardActions.CardDetailsScreen.iconButtonText.viewPin")}
        inactiveLabel={t("CardActions.CardDetailsScreen.iconButtonText.viewPin")}
        icon={<LockIcon />}
      />
    </Stack>
  );
}
