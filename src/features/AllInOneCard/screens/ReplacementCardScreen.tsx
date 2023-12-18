import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Radio from "@/components/Radio";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { ReplacementCardReasons } from "../mocks";

export default function ReplacementCardScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [isWarningModalVisible, setIsWarningModalVisible] = useState<boolean>(false);
  const [reasonIsToggled, setReasonIsToggled] = useState<string>();

  const handleCloseCardMainButton = () => {
    setIsWarningModalVisible(true);
  };

  const handleOnCloseCard = () => {
    setIsWarningModalVisible(false);
    navigation.navigate("AllInOneCard.CardReplacementFeesScreen");
  };

  const bodyContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));
  const textPaddingStyle = useThemeStyles<TextStyle>(theme => ({
    paddingTop: theme.spacing["8p"],
    paddingBottom: theme.spacing["24p"],
  }));
  const boxContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["20p"],
    paddingHorizontal: theme.spacing["16p"],
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.medium,
    width: "100%",
  }));
  const paddingContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
  }));
  const containerViewStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    marginTop: theme.spacing["16p"],
  }));

  return (
    <Page testID="AllInOneCard.ReplacementCardScreen:Page" insets={["left", "right", "top"]}>
      <NavHeader
        title={t("AllInOneCard.ReplacementCardScreen.title")}
        testID="AllInOneCard.ReplacementCardScreen:navHeader"
      />
      <View style={containerViewStyle}>
        <ScrollView>
          <Stack direction="vertical" style={bodyContainerStyle}>
            <Typography.Text size="large" weight="medium">
              {t("AllInOneCard.ReplacementCardScreen.reason")}
            </Typography.Text>

            <Typography.Text size="callout" color="neutralBase+20" style={textPaddingStyle}>
              {t("AllInOneCard.ReplacementCardScreen.reasonDescription")}{" "}
            </Typography.Text>
            <Stack direction="vertical" gap="16p" style={styles.fullWidth}>
              {ReplacementCardReasons.map(item => (
                <Pressable onPress={() => setReasonIsToggled(item.Code)} key={item.Code} style={styles.fullWidth}>
                  <Stack
                    direction="horizontal"
                    justify="space-between"
                    align="center"
                    gap="8p"
                    key={item.Code}
                    style={boxContainerStyle}>
                    <Stack direction="vertical" style={styles.textWidth}>
                      <Typography.Text size="callout" weight="medium" color="neutralBase+30">
                        {item.Name}
                      </Typography.Text>
                      <Typography.Text size="footnote" color="neutralBase+10">
                        {item.Description}
                      </Typography.Text>
                    </Stack>
                    <Radio
                      isSelected={item.Code === reasonIsToggled}
                      onPress={() => setReasonIsToggled(item.Code)}
                      testID="AllInOneCard.ReplacementCardScreen:Radio"
                    />
                  </Stack>
                </Pressable>
              ))}
            </Stack>
          </Stack>
        </ScrollView>
        <View style={paddingContainerStyle}>
          <Button
            disabled={!reasonIsToggled}
            onPress={handleCloseCardMainButton}
            testID="AllInOneCard.ReplacementCardScreen:Button">
            {t("AllInOneCard.ReplacementCardScreen.mainButton")}
          </Button>
        </View>
      </View>
      <NotificationModal
        variant="warning"
        title={t("AllInOneCard.ReplacementCardScreen.warningModal.title")}
        message={t("AllInOneCard.ReplacementCardScreen.warningModal.message")}
        isVisible={isWarningModalVisible}
        buttons={{
          primary: (
            <Button onPress={handleOnCloseCard}>
              {t("AllInOneCard.ReplacementCardScreen.warningModal.closeButton")}
            </Button>
          ),
          secondary: (
            <Button onPress={() => setIsWarningModalVisible(false)}>
              {t("AllInOneCard.ReplacementCardScreen.warningModal.cancelButton")}
            </Button>
          ),
        }}
        testID="AllInOneCard.PermanentCardClosureScreen:WarningModal"
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    width: "100%",
  },
  textWidth: {
    width: "80%",
  },
});
