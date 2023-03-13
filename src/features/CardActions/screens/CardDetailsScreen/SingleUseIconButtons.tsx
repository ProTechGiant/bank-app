import { createElement } from "react";
import { useTranslation } from "react-i18next";

import { HideIcon, InfoCircleIcon, ShowIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import useNavigation from "@/navigation/use-navigation";

import IconButton from "./IconButton";

interface SingleUseIconButtonsProps {
  isShowingDetails: boolean;
  onPressShowDetails: () => void;
}

export default function SingleUseIconButtons({ isShowingDetails, onPressShowDetails }: SingleUseIconButtonsProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleOnPressAbout = () => {
    navigation.navigate("CardActions.SingleUseCardAbout");
  };

  return (
    <Stack direction="horizontal" justify="center" gap="24p">
      <IconButton
        active={isShowingDetails}
        activeLabel={t("CardActions.CardDetailsScreen.iconButtonText.hideCredentials")}
        inactiveLabel={t("CardActions.CardDetailsScreen.iconButtonText.showCredentials")}
        onPress={onPressShowDetails}
        icon={createElement(isShowingDetails ? HideIcon : ShowIcon, { height: 24, width: 24 })}
      />
      <IconButton
        onPress={handleOnPressAbout}
        inactiveLabel={t("CardActions.CardDetailsScreen.iconButtonText.about")}
        icon={<InfoCircleIcon />}
      />
    </Stack>
  );
}
