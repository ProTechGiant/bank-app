import { useTranslation } from "react-i18next";
import { Image, ViewStyle } from "react-native";

import { DiamondIcon } from "@/assets/icons";
import Button from "@/components/Button";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import CroatiaPlusUpSell from "../assets/croatia-plus-up-sell.png";

interface UpgradeToCroatiaPlusProps {
  onPress: () => void;
}

export default function UpgradeToCroatiaPlus({ onPress }: UpgradeToCroatiaPlusProps) {
  const { t } = useTranslation();

  const croatiaPlusUpSellContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingStart: theme.spacing["20p"],
    alignSelf: "center",
    borderRadius: theme.radii.small,
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
  }));

  const croatiaPlusInfoContainerStyle = useThemeStyles(theme => ({
    marginVertical: theme.spacing["20p"],
  }));

  const iconColor = useThemeStyles(theme => theme.palette.complimentBase);

  const croatiaPlusImageStyle = useThemeStyles(theme => ({
    borderRadius: theme.radii.small,
  }));

  return (
    <Stack direction="horizontal" style={croatiaPlusUpSellContainerStyle} justify="space-between" align="center">
      <Stack direction="vertical" flex={1} style={croatiaPlusInfoContainerStyle}>
        <Stack direction="vertical" justify="space-between" flex={1} align="flex-start">
          <Typography.Text color="neutralBase+30" size="callout" weight="medium">
            <DiamondIcon color={iconColor} /> {t("CardActions.CardDetailsScreen.upgradeToCroatiaPlus.header")}
          </Typography.Text>
          <Stack direction="vertical">
            <Typography.Text color="neutralBase+30" size="callout" weight="medium">
              {t("CardActions.CardDetailsScreen.upgradeToCroatiaPlus.subTitle")}
            </Typography.Text>
            <Typography.Text color="neutralBase-10" size="footnote" weight="regular">
              {t("CardActions.CardDetailsScreen.upgradeToCroatiaPlus.content")}
            </Typography.Text>
          </Stack>
          <Button variant="primary" size="mini" onPress={onPress}>
            {t("CardActions.CardDetailsScreen.upgradeToCroatiaPlus.button")}
          </Button>
        </Stack>
      </Stack>
      <Image resizeMode="contain" source={CroatiaPlusUpSell} style={croatiaPlusImageStyle} />
    </Stack>
  );
}
