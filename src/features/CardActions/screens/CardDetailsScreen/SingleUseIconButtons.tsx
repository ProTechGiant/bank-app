import { createElement } from "react";
import { useTranslation } from "react-i18next";

import { HideIcon, InfoCircleIcon, ShowIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import useNavigation from "@/navigation/use-navigation";

import IconButton from "./IconButton";

interface SingleUseIconButtonsProps {
  showDetails: boolean;
  onPressShowDetails: () => void;
}

export default function SingleUseIconButtons({ showDetails, onPressShowDetails }: SingleUseIconButtonsProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleOnPressAbout = () => {
    navigation.navigate("CardActions.SingleUseCardAbout");
  };

  return (
    <Stack direction="horizontal" justify="center" gap="24p">
      <IconButton
        active={showDetails}
        activeLabel={t("CardActions.CardDetailsScreen.iconButtonText.hideCredentials")}
        inactiveLabel={t("CardActions.CardDetailsScreen.iconButtonText.showCredentials")}
        onPress={onPressShowDetails}
        icon={createElement(showDetails ? HideIcon : ShowIcon, { height: 24, width: 24 })}
      />
      <IconButton
        onPress={handleOnPressAbout}
        inactiveLabel={t("CardActions.CardDetailsScreen.iconButtonText.about")}
        icon={<InfoCircleIcon />}
      />
    </Stack>
  );
}
