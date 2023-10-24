import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { CloseIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { MutualFundOrderDetailsTable } from "../components";

export default function MutualFundOrderDetailsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleOnPressCloseIcon = () => {
    //TODO: Navigate to specific screen
  };

  const handleOnPressDone = () => {
    navigation.navigate("MutualFund.DiscoverProducts");
  };

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({ padding: theme.spacing["20p"] }));

  const orderSummaryButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <NavHeader end={<NavHeader.IconEndButton icon={<CloseIcon />} onPress={handleOnPressCloseIcon} />} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Stack direction="vertical" gap="24p" style={contentStyle} align="stretch">
          <Typography.Text size="large" weight="medium">
            {t("MutualFund.MutualFundOrderDetailsScreen.headerTitle")}
          </Typography.Text>
          <MutualFundOrderDetailsTable hasHeader={true} />
        </Stack>
      </ScrollView>
      <View style={orderSummaryButtonStyle}>
        <Button onPress={handleOnPressDone}>{t("MutualFund.MutualFundOrderDetailsScreen.button")}</Button>
      </View>
    </Page>
  );
}
