import { yupResolver } from "@hookform/resolvers/yup";
import { differenceInDays } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import * as Yup from "yup";

import { QuestionIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import CurrencyInput from "@/components/Form/CurrencyInput";
import DatePickerInput from "@/components/Form/DatePickerInput";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import Modal from "@/components/Modal";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import { TableListCard, TableListCardGroup } from "@/components/TableList";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import useThemeStyles from "@/theme/use-theme-styles";
import { alphaNumericSpaceRegExp } from "@/utils";

import { useCreateGoal, useRoundupFlag } from "../hooks/query-hooks";
import { CreateGoalInput } from "../types";

export default function CreateGoalScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const createGoalAsync = useCreateGoal();
  const { data } = useRoundupFlag();

  const validationSchema = useMemo(
    () =>
      Yup.object({
        GoalName: Yup.string()
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

    Alert.alert(
      t("SavingsGoals.CreateGoalScreen.roundUpsAlreadyActiveAlert.title"),
      t("SavingsGoals.CreateGoalScreen.roundUpsAlreadyActiveAlert.message"),
      [
        {
          text: t("SavingsGoals.CreateGoalScreen.roundUpsAlreadyActiveAlert.dontSwitch"),
          onPress: () => setValue("RoundupFlag", false),
        },
        { text: t("SavingsGoals.CreateGoalScreen.roundUpsAlreadyActiveAlert.switch"), style: "default" },
      ]
    );
  }, [RoundupFlag]);

  const handleOnNotificationPress = () => {
    if (NotificationFlag) {
      setValue("NotificationFlag", false);
    } else {
      Alert.alert(
        t("SavingsGoals.CreateGoalScreen.notificationsTurnOnAlert.title"),
        t("SavingsGoals.CreateGoalScreen.notificationsTurnOnAlert.message"),
        [
          {
            text: t("SavingsGoals.CreateGoalScreen.notificationsTurnOnAlert.cancel"),
          },
          {
            text: t("SavingsGoals.CreateGoalScreen.notificationsTurnOnAlert.turnOn"),
            onPress: () => setValue("NotificationFlag", true),
          },
        ]
      );
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
        <NavHeader withBackButton />
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
              />
              <CurrencyInput
                control={control}
                label={t("SavingsGoals.CreateGoalScreen.form.amount.label")}
                name="TargetAmount"
                placeholder={t("SavingsGoals.CreateGoalScreen.form.amount.placeholder")}
                maxLength={10}
                showCharacterCount={false}
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
              />
              <TableListCardGroup>
                <TableListCard
                  label={t("SavingsGoals.CreateGoalScreen.form.roundUps.label")}
                  helperText={t("SavingsGoals.CreateGoalScreen.form.roundUps.helperText")}
                  onInfoPress={() => setIsInfoModalVisible(true)}
                  end={
                    <TableListCard.Toggle onPress={() => setValue("RoundupFlag", !RoundupFlag)} value={RoundupFlag} />
                  }
                />
                <TableListCard
                  label={t("SavingsGoals.CreateGoalScreen.form.notification.label")}
                  helperText={t("SavingsGoals.CreateGoalScreen.form.notification.helperText")}
                  end={<TableListCard.Toggle onPress={handleOnNotificationPress} value={NotificationFlag} />}
                />
              </TableListCardGroup>
            </Stack>
          </View>
          <View style={styles.buttonContainer}>
            <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
              {t("SavingsGoals.CreateGoalScreen.button")}
            </SubmitButton>
          </View>
        </ContentContainer>
      </Page>
      <Modal visible={isInfoModalVisible} onClose={handleOnModalClose}>
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
                Alert.alert("FAQ Page is coming soon!");
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
