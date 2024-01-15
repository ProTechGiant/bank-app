import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { DiamondSmallIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { CustomerTierEnum } from "@/types/CustomerProfile";

interface TagsProps {
  isNew: boolean;
  isPlus: boolean;
  userTier: CustomerTierEnum;
}

export default function Tags({ isNew, isPlus, userTier }: TagsProps) {
  const { t } = useTranslation();
  const tagStyle = useThemeStyles(theme => ({
    paddingHorizontal: theme.spacing["8p"],
    paddingVertical: theme.spacing["4p"],
    marginEnd: theme.spacing["16p"],
  }));

  const newTagStyle = useThemeStyles(theme => ({
    backgroundColor: theme.palette["secondary_pinkBase-30"],
  }));

  const croatiaPlusTagStyle = useThemeStyles(theme => ({
    backgroundColor: theme.palette["neutralBase+30"],
  }));
  return (
    <Stack direction="horizontal">
      {isNew ? (
        <View style={[tagStyle, newTagStyle]}>
          <Typography.Text color="neutralBase+30" size="caption2" weight="medium" align="center">
            {t("Appreciation.HubScreen.new")}
          </Typography.Text>
        </View>
      ) : (
        <View style={[tagStyle, newTagStyle]}>
          <Typography.Text color="neutralBase+30" size="caption2" weight="medium" align="center">
            {t("Appreciation.HubScreen.expired")}
          </Typography.Text>
        </View>
      )}
      {isPlus && userTier === CustomerTierEnum.STANDARD && (
        <View style={[tagStyle, croatiaPlusTagStyle]}>
          <Typography.Text color="supportBase-10" size="caption2" weight="medium">
            <DiamondSmallIcon /> {t("Appreciation.HubScreen.croatiaPlus")}
          </Typography.Text>
        </View>
      )}
    </Stack>
  );
}
