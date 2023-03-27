import { createElement } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import { HideIcon, InfoCircleIcon, ShowIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import IconButton from "./IconButton";

interface SingleUseCardButtonsProps {
  isShowingDetails: boolean;
  onShowDetailsPress: () => void;
}

export default function SingleUseCardButtons({ isShowingDetails, onShowDetailsPress }: SingleUseCardButtonsProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleOnPressAbout = () => {
    navigation.navigate("CardActions.SingleUseCardAbout");
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["16p"],
  }));

  return (
    <View style={containerStyle}>
      <Stack direction="horizontal" justify="center" gap="24p">
        <IconButton
          active={isShowingDetails}
          activeLabel={t("CardActions.CardDetailsScreen.iconButtonText.hide")}
          inactiveLabel={t("CardActions.CardDetailsScreen.iconButtonText.show")}
          onPress={onShowDetailsPress}
          icon={createElement(isShowingDetails ? HideIcon : ShowIcon, { height: 24, width: 24 })}
        />
        <IconButton
          onPress={handleOnPressAbout}
          inactiveLabel={t("CardActions.CardDetailsScreen.iconButtonText.about")}
          icon={<InfoCircleIcon />}
        />
      </Stack>
    </View>
  );
}
