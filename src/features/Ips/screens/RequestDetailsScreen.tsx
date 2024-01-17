import { RouteProp, useRoute } from "@react-navigation/native";
import { format } from "date-fns";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, View, ViewStyle } from "react-native";

import { ChevronBottomIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import { TextInput } from "@/components/Input";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import { DaysModal } from "../components";
import { IpsStackParams } from "../IpsStack";
import { DaysType, RequestDetailsScreenTypeEnum } from "../type";

export default function RequestDetailsScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const {
    params: { IBAN, amount, bank, name, type, expireAfter, referenceNumber, status },
  } = useRoute<RouteProp<IpsStackParams, "IpsStack.RequestDetails">>();

  const [comment, setComment] = useState<string>("");
  const [numberOfDaysSelected, setNumberOfDaysSelected] = useState<DaysType>();
  const [isDaysModalVisible, setIsDaysModalVisible] = useState<boolean>(false);
  const [isCancelRequestModalVisible, setIsCancelRequestModalVisible] = useState<boolean>(false);

  const isConfirmRequest = type === RequestDetailsScreenTypeEnum.CONFIRM;
  const isPendingRequest = type === RequestDetailsScreenTypeEnum.PENDING;
  const isFinishedRequest = type === RequestDetailsScreenTypeEnum.FINISHED;
  const isRequestButtonDisabled = (isConfirmRequest && numberOfDaysSelected === undefined) || false;

  const FIELDS: { title: string; value?: string; hidden?: boolean }[] = [
    { title: t("Ips.RequestDetailsScreen.amount"), value: formatCurrency(amount, "SAR") },
    { title: t("Ips.RequestDetailsScreen.iban"), value: IBAN },
    { title: t("Ips.RequestDetailsScreen.bank"), value: bank },
    { title: t("Ips.RequestDetailsScreen.date"), value: format(new Date(), "iii d MMMM, hh:mm b") },
    { title: t("Ips.RequestDetailsScreen.referenceNumber"), value: referenceNumber, hidden: isConfirmRequest },
    { title: t("Ips.RequestDetailsScreen.status"), value: status, hidden: isConfirmRequest },
    { title: t("Ips.RequestDetailsScreen.expireAfter"), value: expireAfter, hidden: isConfirmRequest },
    //TODO ask about the fees and the VAT
    { title: t("Ips.RequestDetailsScreen.fees"), value: formatCurrency(6, "SAR") },
    { title: t("Ips.RequestDetailsScreen.vat"), value: formatCurrency(6, "SAR") },
    { title: t("Ips.RequestDetailsScreen.comments"), value: "sending to family", hidden: isConfirmRequest },
  ];

  const handleOnBackPress = () => {
    if (isConfirmRequest) {
      navigation.goBack();
    } else {
      navigation.navigate("Ips.IpsStack", { screen: "IpsStack.HubScreen" });
    }
  };

  const handleOnPrimaryButtonPress = () => {
    if (!isRequestButtonDisabled) {
      if (isConfirmRequest) {
        //TODO call the api
        navigation.navigate("Ips.IpsStack", {
          screen: "IpsStack.SuccessfulRequest",
          params: { amount, name, referenceNumber },
        });
      } else {
        setIsCancelRequestModalVisible(true);
      }
    }
  };

  const handleOnSecondaryButtonPress = () => {
    navigation.goBack();
  };

  const handleOnCancelRequest = () => {
    //TODO
  };

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
    marginBottom: theme.spacing["32p"],
  }));

  const lineStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    width: "100%",
    height: theme.radii.extraSmall,
  }));

  const fieldContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    paddingVertical: theme.spacing["16p"],
  }));

  const daysButtonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["12p"],
    marginBottom: theme.spacing["32p"],
  }));

  const daysButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "stretch",
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["12p"],
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.radii.medium,
  }));

  const chevronIconColor = useThemeStyles(theme => theme.palette["neutralBase-20"]);

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader title={t("Ips.RequestDetailsScreen.title")} onBackPress={handleOnBackPress} />
      <ScrollView style={contentContainerStyle}>
        <Stack direction="vertical" gap="12p">
          <Typography.Header size="large" style={!isConfirmRequest ? styles.hiddenStyle : undefined}>
            {t("Ips.RequestDetailsScreen.confirmRequest")}
          </Typography.Header>
          <Typography.Text size="callout" weight="medium" color="neutralBase">
            {t("Ips.RequestDetailsScreen.to")}
          </Typography.Text>
          <Typography.Text weight="medium" size="title2">
            {name}
          </Typography.Text>
          <Typography.Text size="footnote">{IBAN}</Typography.Text>
        </Stack>
        <View style={lineStyle} />
        <Stack direction="vertical" gap="12p">
          {FIELDS.map(field =>
            !field.hidden ? (
              <Stack direction="horizontal" justify="space-between" style={[fieldContainerStyle]} id={field.title}>
                <Typography.Text size="callout" weight="medium">
                  {field.title}
                </Typography.Text>
                <Typography.Text size="callout" weight="medium">
                  {field.value}
                </Typography.Text>
              </Stack>
            ) : undefined
          )}
        </Stack>

        <View style={!isConfirmRequest ? styles.hiddenStyle : undefined}>
          <TextInput
            label="Comment"
            numberOfLines={5}
            onChangeText={setComment}
            value={comment}
            extraStart="Optional"
          />
          <Stack direction="vertical" style={daysButtonContainerStyle}>
            <Typography.Text weight="medium">{t("Ips.RequestDetailsScreen.expireAfter")}</Typography.Text>
            <Pressable onPress={() => setIsDaysModalVisible(true)} style={styles.fullWidth}>
              <Stack direction="horizontal" style={daysButtonStyle} justify="space-between">
                <Typography.Text>
                  {numberOfDaysSelected !== undefined ? t(`Ips.RequestDetailsScreen.days.${numberOfDaysSelected}`) : ""}
                </Typography.Text>
                <ChevronBottomIcon color={chevronIconColor} />
              </Stack>
            </Pressable>
          </Stack>
        </View>
        <View style={isFinishedRequest ? styles.hiddenStyle : undefined}>
          <Button disabled={isRequestButtonDisabled} onPress={handleOnPrimaryButtonPress} block>
            <Typography.Text color={isRequestButtonDisabled ? "neutralBase+30" : "neutralBase-60"}>
              {isConfirmRequest
                ? t("Ips.RequestDetailsScreen.requestNow")
                : t("Ips.RequestDetailsScreen.cancelRequest")}
            </Typography.Text>
          </Button>
          <Button variant="tertiary" onPress={handleOnSecondaryButtonPress} block>
            <Typography.Text>
              {isConfirmRequest ? t("Ips.RequestDetailsScreen.cancel") : t("Ips.RequestDetailsScreen.close")}
            </Typography.Text>
          </Button>
        </View>
      </ScrollView>
      <DaysModal
        isVisible={isDaysModalVisible}
        onClose={() => setIsDaysModalVisible(false)}
        setValue={setNumberOfDaysSelected}
        selectedValue={numberOfDaysSelected}
      />
      <NotificationModal
        isVisible={isCancelRequestModalVisible && isPendingRequest}
        title={t("Ips.RequestDetailsScreen.cancelRequest")}
        variant="error"
        message={t("Ips.RequestDetailsScreen.cancelRequestSubtitle")}
        onClose={() => setIsCancelRequestModalVisible(false)}
        buttons={{
          primary: (
            <Button onPress={handleOnCancelRequest}>
              <Typography.Text color="neutralBase-60">{t("Ips.RequestDetailsScreen.yes")}</Typography.Text>
            </Button>
          ),
        }}
      />
    </Page>
  );
}
const styles = StyleSheet.create({
  fullWidth: {
    width: "100%",
  },
  hiddenStyle: {
    display: "none",
  },
});
