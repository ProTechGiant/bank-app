import { yupResolver } from "@hookform/resolvers/yup";
import { differenceInDays } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, Linking, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { checkNotifications } from "react-native-permissions";
import * as Yup from "yup";

import { QuestionIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import CurrencyInput from "@/components/Form/CurrencyInput";
import DatePickerInput from "@/components/Form/DatePickerInput";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import List from "@/components/List";
import Modal from "@/components/Modal";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import useThemeStyles from "@/theme/use-theme-styles";
import { alphaNumericSpaceRegExp } from "@/utils";

import RoundUpsIcon from "../assets/round-ups";
import { useCreateGoal, useRoundupFlag, useSGNotificationPreferences } from "../hooks/query-hooks";
import { CreateGoalInput } from "../types";

export default function CreateGoalScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const createGoalAsync = useCreateGoal();
  const { data } = useRoundupFlag();
  const { data: notificationPreferences } = useSGNotificationPreferences();
  const [isRoundUpsModalVisible, setIsRoundUpsModalVisible] = useState(false);

  const validationSchema = useMemo(
    () =>
      Yup.object({
        GoalName: Yup.string()
          .trim()
          .required(t("SavingsGoals.CreateGoalScreen.form.name.validation.required"))
          .matches(alphaNumericSpaceRegExp, t("SavingsGoals.CreateGoalScreen.form.name.validation.invalid")),
        TargetAmount: Yup.number()
          .required(t("SavingsGoals.CreateGoalScreen.form.amount.validation.required"))
          .min(0.01, t("SavingsGoals.CreateGoalScreen.form.name.validation.required"))
          .max(9999999999.99, t("SavingsGoals.CreateGoalScreen.form.amount.validation.invalid")),
        TargetDate: Yup.date().required(t("SavingsGoals.CreateGoalScreen.form.targetDate.validation.required")),
      }),
    [t]
  );

  const { control, handleSubmit, watch, setValue } = useForm<CreateGoalInput>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      NotificationFlag: false,
      RoundupFlag: false,
    },
  });

  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const NotificationFlag = watch("NotificationFlag");
  const RoundupFlag = watch("RoundupFlag");

  useEffect(() => {
    if (!RoundupFlag) return;
    if (data?.IsRoundUpActive === false) return;

    setIsRoundUpsModalVisible(true);
  }, [RoundupFlag, t, data, setValue]);

  const handleOnNotificationPress = async () => {
    const notificationPermission = await checkNotifications();

    //TODO: ALERTS WILL BE REPLACED BY NOTIFICATION MODAL ONCE WE WILL HAVE UPDATED DESIGNS
    if (notificationPermission.status !== "granted") {
      Alert.alert(
        t("SavingsGoals.PermissionAlertModal.nativeTitle"),
        t("SavingsGoals.PermissionAlertModal.nativeSubtitle"),
        [
          {
            text: t("SavingsGoals.PermissionAlertModal.back"),
            style: "cancel",
            onPress: () => null,
          },
          {
            text: t("SavingsGoals.PermissionAlertModal.settings"),
            onPress: () => {
              Linking.openSettings().then;
            },
          },
        ]
      );
      //if permissions are not granted we are not going to execute the other code
      return;
    }

    if (notificationPreferences?.NotificationPreferencesFlag && NotificationFlag) {
      setValue("NotificationFlag", false);
    } else if (notificationPreferences?.NotificationPreferencesFlag && !NotificationFlag) {
      setValue("NotificationFlag", true);
    } else {
      Alert.alert(t("SavingsGoals.PermissionAlertModal.appTitle"), t("SavingsGoals.PermissionAlertModal.appSubtitle"), [
        {
          text: t("SavingsGoals.PermissionAlertModal.back"),
          style: "cancel",
          onPress: () => null,
        },
        {
          text: t("SavingsGoals.PermissionAlertModal.settings"),
          onPress: () => {
            handleTurnOnNotificationFlag();
          },
        },
      ]);
    }
  };

  const handleOnSubmit = async (values: CreateGoalInput) => {
    try {
      const response = await createGoalAsync.mutateAsync(values);

      navigation.navigate("SavingsGoals.GoalDetailsScreen", {
        PotId: response.PotId,
        redirectToFundingModal: true,
      });
    } catch (error) {
      const errorObject = JSON.parse(JSON.stringify(error));
      const objectMessage = errorObject.errorContent.Message;

      const errorMessage = objectMessage ? objectMessage : t("errors.generic.message");

      Alert.alert(t("errors.generic.title"), errorMessage, [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);

      warn("savings-goals", "Could not submit saving goal details: ", JSON.stringify(error));
    }
  };

  const handleOnModalClose = () => {
    setIsInfoModalVisible(false);
  };

  const handleTurnOnNotificationFlag = () => {
    setValue("NotificationFlag", true);
  };

  const handleTurnOffRoundupFlag = () => {
    setValue("RoundupFlag", false);
    setIsRoundUpsModalVisible(current => !current);
  };

  const titleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  const formContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["48p"],
  }));

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["24p"],
  }));

  const iconStyle = useThemeStyles<ViewStyle>(theme => ({
    marginRight: theme.spacing["4p"],
  }));

  const questionIconColor = useThemeStyles<string>(theme => theme.palette.primaryBase, []);

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader withBackButton testID="SavingsGoals.CreateGoalScreen:NavHeader" />
        <ContentContainer isScrollView>
          <View style={formContainerStyle}>
            <Typography.Text size="large" weight="bold" style={titleStyle}>
              {t("SavingsGoals.CreateGoalScreen.title")}
            </Typography.Text>
            <Stack direction="vertical" align="stretch" gap="24p">
              <TextInput
                control={control}
                label={t("SavingsGoals.CreateGoalScreen.form.name.label")}
                name="GoalName"
                placeholder={t("SavingsGoals.CreateGoalScreen.form.name.placeholder")}
                maxLength={50}
                testID="SavingsGoals.CreateGoalScreen:GoalNameInput"
              />
              <CurrencyInput
                control={control}
                label={t("SavingsGoals.CreateGoalScreen.form.amount.label")}
                name="TargetAmount"
                placeholder={t("SavingsGoals.CreateGoalScreen.form.amount.placeholder")}
                maxLength={10}
                showCharacterCount={false}
                testID="SavingsGoals.CreateGoalScreen:TargetAmountInput"
              />
              <DatePickerInput
                control={control}
                placeholder={t("SavingsGoals.CreateGoalScreen.form.targetDate.openDatePickerButton")}
                headerText={t("SavingsGoals.CreateGoalScreen.form.targetDate.headerText")}
                label={t("SavingsGoals.CreateGoalScreen.form.targetDate.label")}
                name="TargetDate"
                buttonText={t("SavingsGoals.CreateGoalScreen.form.targetDate.datePickerButton")}
                minimumDate={new Date()}
                helperText={currentDate => {
                  return differenceInDays(currentDate, new Date()) < 31
                    ? t("SavingsGoals.CreateGoalScreen.form.targetDate.helperText")
                    : undefined;
                }}
                testID="SavingsGoals.CreateGoalScreen:TargetDateInput"
              />
              <List isBordered>
                <List.Item.Primary
                  label={t("SavingsGoals.CreateGoalScreen.form.roundUps.label")}
                  helperText={t("SavingsGoals.CreateGoalScreen.form.roundUps.helperText")}
                  onMoreInfoPress={() => setIsInfoModalVisible(true)}
                  end={
                    <List.End.Toggle
                      onPress={() => setValue("RoundupFlag", !RoundupFlag)}
                      testID="SavingsGoals.CreateGoalScreen:RoundupsActiveInput"
                      value={RoundupFlag}
                    />
                  }
                />
                <List.Item.Primary
                  label={t("SavingsGoals.CreateGoalScreen.form.notification.label")}
                  helperText={t("SavingsGoals.CreateGoalScreen.form.notification.helperText")}
                  end={
                    <List.End.Toggle
                      onPress={handleOnNotificationPress}
                      testID="SavingsGoals.CreateGoalScreen:NotificationsActiveInput"
                      value={NotificationFlag}
                    />
                  }
                />
              </List>
            </Stack>
          </View>
          <View style={styles.buttonContainer}>
            <SubmitButton
              control={control}
              onSubmit={handleSubmit(handleOnSubmit)}
              testID="SavingsGoals.CreateGoalScreen:SubmitButton">
              {t("SavingsGoals.CreateGoalScreen.button")}
            </SubmitButton>
          </View>
        </ContentContainer>
      </Page>
      <Modal visible={isInfoModalVisible} onClose={handleOnModalClose} testID="SavingsGoals.CreateGoalScreen:InfoModal">
        <View style={contentContainerStyle}>
          <Stack direction="vertical" gap="8p">
            <Typography.Text color="neutralBase+30" size="title2" weight="bold">
              {t("SavingsGoals.CreateGoalScreen.aboutRoundUpsPanel.title")}
            </Typography.Text>
            <Typography.Text color="neutralBase+30" size="callout">
              {t("SavingsGoals.CreateGoalScreen.aboutRoundUpsPanel.content")}
            </Typography.Text>
            <Pressable
              style={styles.iconLink}
              onPress={() => {
                Alert.alert("FAQ Page is coming soon!"); // TODO: navigate to FAQ page
              }}>
              <View style={iconStyle}>
                <QuestionIcon color={questionIconColor} />
              </View>
              <Typography.Text color="primaryBase" size="footnote">
                {t("SavingsGoals.CreateGoalScreen.aboutRoundUpsPanel.smallText")}
              </Typography.Text>
            </Pressable>
          </Stack>
        </View>
      </Modal>
      <NotificationModal
        variant="confirmations"
        icon={<RoundUpsIcon />}
        message={t("SavingsGoals.CreateGoalScreen.roundUpsAlreadyActiveAlert.message")}
        title={t("SavingsGoals.CreateGoalScreen.roundUpsAlreadyActiveAlert.title")}
        isVisible={isRoundUpsModalVisible}
        buttons={{
          primary: (
            <Button
              onPress={() => setIsRoundUpsModalVisible(current => !current)}
              testID="SavingsGoals.CreateGoalScreen:SwitchRoundUpsButton">
              {t("SavingsGoals.CreateGoalScreen.roundUpsAlreadyActiveAlert.switch")}
            </Button>
          ),
          secondary: (
            <Button onPress={handleTurnOffRoundupFlag} testID="SavingsGoals.CreateGoalScreen:DontSwitchRoundUpsButton">
              {t("SavingsGoals.CreateGoalScreen.roundUpsAlreadyActiveAlert.dontSwitch")}
            </Button>
          ),
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: "auto",
  },
  iconLink: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
  },
});
