import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import { CloseIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface HeaderEditHomeProps {
  handleOnClose: () => void;
  handleOnSave: () => void;
  disabled: boolean;
}

export default function HeaderEditHome({ handleOnClose, handleOnSave, disabled }: HeaderEditHomeProps) {
  const { t } = useTranslation();

  const iconColor = useThemeStyles<string>(theme => theme.palette.neutralBase);
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing["16p"],
    justifyContent: "space-between",
    borderTopLeftRadius: theme.radii.medium,
    borderTopRightRadius: theme.radii.medium,
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  return (
    <View style={containerStyle}>
      <Pressable onPress={handleOnClose}>
        <CloseIcon color={iconColor} />
      </Pressable>
      <Typography.Text size="callout" weight="medium" color="neutralBase+30">
        {t("Settings.HomeCustomization.HeaderEditHome.title")}
      </Typography.Text>
      <Pressable onPress={handleOnSave} disabled={disabled}>
        <Typography.Text size="callout" weight="medium" color={disabled ? "neutralBase-10" : "neutralBase+30"}>
          {t("Settings.HomeCustomization.HeaderEditHome.saveButton")}
        </Typography.Text>
      </Pressable>
    </View>
  );
}
