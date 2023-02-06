import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { QuestionIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import SubmitButton from "@/components/Form/SubmitButton";
import Modal from "@/components/Modal";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useThemeStyles from "@/theme/use-theme-styles";

import ToggleCards from "./ToggleCard";

export default function SavingsGoalsModal() {
  const { control, handleSubmit } = useForm({});
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [isNotificationOn, setIsNotificationOn] = useState(false);
  const [isRoundsUpOn, setIsRoundsUpOn] = useState(false);

  const handleNotificationOnPress = (value: boolean) => {
    const alertMessage = value ? "Turned on notification" : "Turned off notification";
    Alert.alert(alertMessage);
    setIsNotificationOn(value);
  };

  const handleRoundsUpOnPress = (value: boolean) => {
    const alertMessage = value ? "Turned on rounds up" : "Turned off rounds up";
    Alert.alert(alertMessage);
    setIsRoundsUpOn(value);
  };

  const handleOnClosePress = () => {
    navigation.navigate("SavingsGoals.SavingsGoalsScreen");
  };

  const handleOnSubmit = () => {
    navigation.navigate("SavingsGoals.SavingsGoalsScreen");
  };
  const handleOnModalClose = () => {
    setIsInfoModalVisible(false);
  };

  const formContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      textAlign: "center",
      paddingHorizontal: theme.spacing.medium,
      backgroundColor: theme.palette["neutralBase-50"],
      borderRadius: theme.radii.small,
    }),
    []
  );
  const titleStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginBottom: theme.spacing.medium,
    }),
    []
  );
  const separatorStyle = useThemeStyles<ViewStyle>(
    theme => ({
      height: 1,
      backgroundColor: theme.palette["neutralBase-30"],
    }),
    []
  );
  const buttonContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginTop: "auto",
      marginBottom: theme.spacing.regular,
    }),
    []
  );
  const contentContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingBottom: theme.spacing.large,
      position: "relative",
    }),
    []
  );
  const iconStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginRight: theme.spacing.xsmall,
    }),
    []
  );

  const questionDimensions = useThemeStyles<number>(theme => theme.iconDimensions.createGoal.question, []);
  const questionIconColor = useThemeStyles<string>(theme => theme.palette["primaryBase"], []);

  return (
    <SafeAreaProvider>
      <Page>
        <NavHeader
          title={t("SavingsGoals.CreateGoalModal.navTitle")}
          withBackButton={false}
          end={<NavHeader.CloseEndButton onPress={handleOnClosePress} />}
        />
        <ContentContainer>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Typography.Text size="large" weight="bold" style={titleStyle}>
              {t("SavingsGoals.CreateGoalModal.title")}
            </Typography.Text>
            <View style={formContainerStyle}>
              <ToggleCards
                label={t("SavingsGoals.CreateGoalModal.form.roundUps.label")}
                helperText={t("SavingsGoals.CreateGoalModal.form.roundUps.helperText")}
                hasInfoIcon={true}
                infoIconOnPress={() => {
                  setIsInfoModalVisible(true);
                }}
                onPress={handleRoundsUpOnPress}
                toggleValue={isRoundsUpOn}
              />
              <View style={separatorStyle} />

              <ToggleCards
                label={t("SavingsGoals.CreateGoalModal.form.notification.label")}
                helperText={t("SavingsGoals.CreateGoalModal.form.notification.helperText")}
                onPress={handleNotificationOnPress}
                toggleValue={isNotificationOn}
              />
            </View>
            <View style={buttonContainerStyle}>
              <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
                {t("SavingsGoals.CreateGoalModal.button")}
              </SubmitButton>
            </View>
          </ScrollView>
        </ContentContainer>
        <Modal visible={isInfoModalVisible} onClose={handleOnModalClose}>
          <View style={contentContainerStyle}>
            <Stack direction="vertical" gap="small">
              <Typography.Text color="primaryBase+30" size="title2" weight="bold">
                {t("SavingsGoals.CreateGoalModal.aboutRoundUpsPanel.title")}
              </Typography.Text>
              <Typography.Text color="primaryBase+30" size="callout">
                {t("SavingsGoals.CreateGoalModal.aboutRoundUpsPanel.content")}
              </Typography.Text>
              <Pressable
                style={styles.iconLink}
                onPress={() => {
                  Alert.alert("FAQ Page is coming soon!");
                }}>
                <View style={iconStyle}>
                  <QuestionIcon height={questionDimensions} width={questionDimensions} color={questionIconColor} />
                </View>
                <Typography.Text color="primaryBase" size="footnote">
                  {t("SavingsGoals.CreateGoalModal.aboutRoundUpsPanel.smallText")}
                </Typography.Text>
              </Pressable>
            </Stack>
          </View>
        </Modal>
      </Page>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  iconLink: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
  },
});
