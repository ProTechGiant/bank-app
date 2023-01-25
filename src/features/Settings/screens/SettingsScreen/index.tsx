import { useTranslation } from "react-i18next";
import { Pressable, ViewStyle } from "react-native";

import { FriendsIcon, QuestionIcon } from "@/assets/icons";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const cardContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      minHeight: 54,
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: "row",
      paddingHorizontal: theme.spacing.medium,
      borderRadius: theme.radii.small,
      backgroundColor: theme.palette["neutralBase-50"],
      marginHorizontal: theme.spacing.regular,
      marginTop: theme.spacing.regular,
    }),
    []
  );
  const iconContainer = useThemeStyles<ViewStyle>(
    theme => ({
      marginRight: theme.spacing.small,
    }),
    []
  );
  const iconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.settingsPage, []);

  const navigation = useNavigation();
  const handleOnReferPress = () => {
    navigation.navigate("Referral.HubScreen");
  };

  return (
    <Page>
      <Pressable style={cardContainerStyle} onPress={handleOnReferPress}>
        <FriendsIcon style={iconContainer} height={iconDimensions} width={iconDimensions} />
        <Typography.Text color="primaryBase+30" size="callout" weight="regular">
          {t("Settings.SettingsScreen.rewards")}
        </Typography.Text>
      </Pressable>
      <Pressable style={cardContainerStyle}>
        <QuestionIcon style={iconContainer} height={iconDimensions} width={iconDimensions} />
        <Typography.Text color="primaryBase+30" size="callout" weight="regular">
          {t("Settings.SettingsScreen.FAQs")}
        </Typography.Text>
      </Pressable>
    </Page>
  );
}
