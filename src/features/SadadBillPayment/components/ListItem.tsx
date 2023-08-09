import { useTranslation } from "react-i18next";
import { ImageStyle, Pressable, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import NetworkImage from "@/components/NetworkImage";
import PlaceholderImage from "@/components/PlaceholderImage";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { Biller, BillerCategory } from "../types";

interface ListItemProps {
  onSelect: (value: BillerCategory | Biller) => void;
  data: BillerCategory | Biller;
}
export default function ListItem({ data, onSelect }: ListItemProps) {
  const { i18n } = useTranslation();

  const chevronIconColor = useThemeStyles(theme => theme.palette["neutralBase-20"]);

  const itemStyle = useThemeStyles(theme => ({
    paddingVertical: theme.spacing["12p"],
  }));

  const listTitleText = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    paddingHorizontal: theme.spacing["12p"],
  }));

  const imageStyle = useThemeStyles<ImageStyle>(theme => ({
    width: theme.spacing["24p"],
    height: theme.spacing["24p"],
  }));

  return (
    <Pressable onPress={() => onSelect(data)}>
      <Stack style={itemStyle} justify="space-between" direction="horizontal">
        {data.LogoUrl !== undefined ? (
          <NetworkImage source={{ uri: data?.LogoUrl }} style={imageStyle} />
        ) : (
          <PlaceholderImage style={imageStyle} />
        )}
        <Typography.Text style={listTitleText} color="neutralBase+30" size="callout" weight="regular">
          {i18n.language === "en" ? data?.NameEn : data?.NameAr}
        </Typography.Text>
        <ChevronRightIcon color={chevronIconColor} />
      </Stack>
    </Pressable>
  );
}
