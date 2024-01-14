import { t } from "i18next";
import { I18nManager, Pressable, ViewStyle } from "react-native";

import { ChevronLeftIcon, ChevronRightIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import CustomStatusBar from "@/components/CustomStatusBar/CustomStatusBar";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function DocumentsEntryScreen() {
  const navigation = useNavigation();

  const handleOnPressAdhoc = () => {
    navigation.navigate("Documents.DocumentsScreen");
  };

  const handleOnPressStatments = () => {
    navigation.navigate("Statements.StatementsStack");
  };

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["20p"],
  }));

  const navHeaderStyle = useThemeStyles(theme => theme.palette["neutralBase+30"]);

  const chevronIconColor = useThemeStyles(theme => theme.palette["neutralBase-20"]);

  const NavHeaderColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);

  return (
    <Page insets={["left", "right"]}>
      <CustomStatusBar barStyle="light-content" backgroundColor={NavHeaderColor} />
      <NavHeader
        hasBackButtonIconBackground={false}
        variant="angled"
        backgroundAngledColor={navHeaderStyle}
        title={t("Documents.DocumentListScreen.title")}
      />
      <ContentContainer style={contentContainerStyle}>
        <Stack direction="vertical" align="stretch" gap="48p">
          <Stack direction="horizontal" justify="space-between" as={Pressable} onPress={handleOnPressAdhoc}>
            <Typography.Text size="callout" weight="medium">
              {t("Documents.DocumentsEntryScreen.document")}
            </Typography.Text>
            {I18nManager.isRTL ? (
              <ChevronLeftIcon color={chevronIconColor} />
            ) : (
              <ChevronRightIcon color={chevronIconColor} />
            )}
          </Stack>
          <Stack direction="horizontal" justify="space-between" as={Pressable} onPress={handleOnPressStatments}>
            <Typography.Text size="callout" weight="medium">
              {t("Documents.DocumentsEntryScreen.statements")}
            </Typography.Text>
            {I18nManager.isRTL ? (
              <ChevronLeftIcon color={chevronIconColor} />
            ) : (
              <ChevronRightIcon color={chevronIconColor} />
            )}
          </Stack>
        </Stack>
      </ContentContainer>
    </Page>
  );
}
