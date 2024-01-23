import { yupResolver } from "@hookform/resolvers/yup";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Keyboard,
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  TextInputChangeEventData,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import * as Yup from "yup";

import { Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import SubmitButton from "@/components/Form/SubmitButton";
import InfoBox from "@/components/InfoBox";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import { useToasts } from "@/contexts/ToastsContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import delayTransition from "@/utils/delay-transition";

import TextInput from "../components/Form/TextInput";
import { useCustomerLimits, useUpdateCustomerLimit } from "../hooks/query-hooks";

type InternalTransfersStackParams = {
  screen: "InternalTransfers.TransferPaymentScreen";
  transferType: string;
};

type InternalTransfersRouteParams = {
  InternalTransfers: InternalTransfersStackParams;
};

type FormValues = {
  dailyLimit: string;
  transactionLimit: string;
  transactionQuickLimit: string;
};

type AllowedFields = "dailyLimit" | "transactionLimit" | "transactionQuickLimit";

export default function TransferPaymentScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const addToast = useToasts();
  const route = useRoute<RouteProp<InternalTransfersRouteParams>>();
  const transferTypeProp: string | undefined = route.params?.transferType;

  const [selectedTab, setSelectedTab] = useState("CRO");
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [isGenericErrorModalVisible, setIsGenericErrorModalVisible] = useState(false);
  const [dailyLimit, setDailyLimit] = useState("");
  const [transactionLimit, setTransactionLimit] = useState("");
  const [transactionQuickLimit, setTransactionQuickLimit] = useState("");
  const [errorTriggerDailyLimit, setErrorTriggerDailyLimit] = useState(false);
  const [errorTriggerTransactionLimit, setErrorTriggerTransactionLimit] = useState(false);
  const [errorTriggerTransactionQuickLimit, setErrorTriggerTransactionQuickLimit] = useState(false);

  const getProductType =
    transferTypeProp === "internalTransfer" ? (selectedTab === "CRO" ? "CRO" : "ARB") : transferTypeProp;
  const { data: customerLimits, isError } = useCustomerLimits(getProductType);

  const availableGlobalLimit = customerLimits ?? null;

  const container = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    padding: theme.spacing["8p"],
  }));
  const tabStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["32p"],
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.xlarge,
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["8p"],
    marginLeft: theme.spacing["8p"],
    alignItems: "center",
  }));
  const tabSelectedColorStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: selectedTab === "CRO" ? theme.palette.complimentBase : theme.palette["neutralBase-60"],
      borderWidth: selectedTab === "CRO" ? 0 : 1,
    }),
    [selectedTab]
  );
  const nonSelectedTabColorStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: selectedTab === "ARB" ? theme.palette.complimentBase : theme.palette["neutralBase-60"],
      borderWidth: selectedTab === "ARB" ? 0 : 1,
    }),
    [selectedTab]
  );
  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["16p"],
    flex: 1,
  }));
  const formContainerStyle = useThemeStyles(theme => ({
    marginBottom: theme.spacing["20p"],
  }));
  const verticalSpacingStyle = useThemeStyles(theme => ({
    paddingBottom: theme.spacing["20p"],
  }));
  const noteSpacingStyle = useThemeStyles(theme => ({
    paddingHorizontal: theme.spacing["16p"],
  }));

  const validationSchema = Yup.object().shape({
    dailyLimit: Yup.string().test("less-than-global-limit", "You exceeded the maximum daily limit", function (value) {
      const globalLimit = availableGlobalLimit?.GlobalLimit;
      if (globalLimit && value && Number(value) > Number(globalLimit)) {
        setErrorTriggerDailyLimit(true);
        return this.createError({
          message: t("InternalTransfers.TransferPaymentScreen.yupValidations.dailyLimitError"),
        });
      }
      setErrorTriggerDailyLimit(false);
      return true;
    }),
    transactionLimit: Yup.string().test("less-than-daily-limit", "You exceed the daily limit", function (value) {
      const { dailyLimit: innerDailyLimit } = this.parent;
      const globalLimit = availableGlobalLimit?.GlobalLimit;

      if (Number(availableGlobalLimit?.ProductLimit) < Number(value) && Number(innerDailyLimit) < Number(value)) {
        value = innerDailyLimit;
        setTransactionLimit(innerDailyLimit);
        return this.createError({
          message: t("InternalTransfers.TransferPaymentScreen.yupValidations.transactionLimitError"),
        });
      }

      if (
        (value && Number(value) > Number(globalLimit)) ||
        (innerDailyLimit && value && Number(value) > Number(innerDailyLimit))
      ) {
        setErrorTriggerTransactionLimit(true);
        return this.createError({
          message: t("InternalTransfers.TransferPaymentScreen.yupValidations.transactionLimitError"),
        });
      }

      setErrorTriggerTransactionLimit(false);
      return true;
    }),
    transactionQuickLimit: Yup.string().test(
      "less-than-max-transaction-limit",
      "You exceeded the maximum transaction limit",
      function (value) {
        if (Number(value) > Number("2500")) {
          setErrorTriggerTransactionQuickLimit(true);
          return this.createError({
            message: t("InternalTransfers.TransferPaymentScreen.yupValidations.transactionQuickLimitError"),
          });
        }
        setErrorTriggerTransactionQuickLimit(false);
        return true;
      }
    ),
  });

  const { control, handleSubmit, trigger, setValue } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
    mode: "onChange" as const,
    defaultValues: {
      dailyLimit: "",
      transactionLimit: "",
      transactionQuickLimit: "",
    },
    shouldUnregister: false,
  });

  useEffect(() => {
    if (isError) {
      setIsGenericErrorModalVisible(true);
    }
  }, [isError]);

  useEffect(() => {
    setValue("dailyLimit", "");
    setValue("transactionLimit", "");
    setValue("transactionQuickLimit", "");
    trigger("dailyLimit");
    trigger("transactionLimit");
    trigger("transactionQuickLimit");
    handlePressOutsideInput();
    setIsFormDirty(false);
  }, [selectedTab, setValue, trigger]);

  const handleOnSwitchTab = (value: string) => {
    handleOnTransactionLimitClear();
    handleOnDailyLimitClear();
    delayTransition(() => {
      setSelectedTab(value);
    });
  };

  const handleInputChange = (field: AllowedFields, value: string) => {
    setValue(field, value);
    setIsFormDirty(true);
    trigger(field);
  };

  const handleOnDailyLimitChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setDailyLimit(e.nativeEvent.text);
    handleInputChange("dailyLimit", e.nativeEvent.text);
  };

  const handleOnDailyLimitClear = () => {
    setValue("dailyLimit", "", { shouldDirty: true });
    handleInputChange("dailyLimit", "");
  };

  const handleOnTransactionLimitChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setTransactionLimit(e.nativeEvent.text);
    handleInputChange("transactionLimit", e.nativeEvent.text);
  };

  const handleOnTransactionLimitClear = () => {
    setValue("transactionLimit", "", { shouldDirty: true });
    handleInputChange("transactionLimit", "");
  };

  const handleOnTransactionQuickLimitChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setTransactionQuickLimit(e.nativeEvent.text);
    handleInputChange("transactionQuickLimit", e.nativeEvent.text);
  };

  const handleOnTransactionQuickLimitClear = () => {
    setValue("transactionQuickLimit", "", { shouldDirty: true });
    handleInputChange("transactionQuickLimit", "");
  };

  const handleOnCancelPress = () => {
    setValue("dailyLimit", "");
    setValue("transactionLimit", "");
    setValue("transactionQuickLimit", "");
    trigger("dailyLimit");
    trigger("transactionLimit");
    trigger("transactionQuickLimit");
    handlePressOutsideInput();
    setIsFormDirty(false);
  };

  const handlePressOutsideInput = () => {
    Keyboard.dismiss();
  };

  const { mutateAsync: updateCustomerLimit } = useUpdateCustomerLimit();

  const params = {
    ProductType: transferTypeProp === "internalTransfer" ? (selectedTab === "CRO" ? "CRO" : "ARB") : transferTypeProp,
    MaxProductLimit: transferTypeProp === "ALIAS" ? "2500" : dailyLimit,
    MaxProductTransactionAmount: transferTypeProp === "ALIAS" ? transactionQuickLimit : transactionLimit,
  };

  const handleOnSubmit = async () => {
    try {
      const result = await updateCustomerLimit(params);

      if (result.Status && result.Status.toLowerCase() === "success") {
        const isIncrease = result.ivrFlag === "Y";

        if (isIncrease) {
          navigation.navigate("InternalTransfers.InternalTransfersStack", {
            screen: "InternalTransfers.IVRWaitingVerificationScreen",
            params: {
              ivrTrackingId: result.IvrTrackingId,
            },
          } as {
            screen: "InternalTransfers.IVRWaitingVerificationScreen";
            params: {
              ivrTrackingId: string;
            };
          });
        } else {
          addToast({
            variant: "success",
            message: t("InternalTransfers.TransferPaymentScreen.limitUpdateMessage"),
            position: "top",
            closable: true,
          });
          navigation.navigate("InternalTransfers.InternalTransfersStack", {
            screen: "InternalTransfers.TransferSettingScreen",
          });
        }
      }
    } catch (error) {
      setIsGenericErrorModalVisible(true);
    }
  };

  const renderTransferContent = () => {
    return (
      <TouchableWithoutFeedback onPress={handlePressOutsideInput}>
        <View style={contentStyle}>
          {customerLimits && (
            <Stack align="stretch" direction="vertical" style={formContainerStyle}>
              <View style={verticalSpacingStyle}>
                <TextInput
                  control={control}
                  label={t("InternalTransfers.TransferPaymentScreen.dailyLimit")}
                  name="dailyLimit"
                  keyboardType="numeric"
                  placeholder={
                    availableGlobalLimit !== null
                      ? `${
                          availableGlobalLimit?.ProductLimit?.toString() +
                          t("InternalTransfers.TransferPaymentScreen.currency")
                        }`
                      : "0" + t("InternalTransfers.TransferPaymentScreen.currency")
                  }
                  onClear={handleOnDailyLimitClear}
                  onChange={e => handleOnDailyLimitChange(e)}
                  testID="InternalTransfers.TransferPaymentScreen:dailyLimitInput"
                />
                {!errorTriggerDailyLimit && (
                  <Typography.Text style={noteSpacingStyle} color="neutralBase" size="caption1" weight="medium">
                    {t("InternalTransfers.TransferPaymentScreen.dailyLimitNote")}
                  </Typography.Text>
                )}
              </View>
              <View style={verticalSpacingStyle}>
                <InfoBox variant="primary" borderPosition="start">
                  {t("InternalTransfers.TransferPaymentScreen.transferLimitInfo", {
                    amount: availableGlobalLimit?.GlobalLimit?.toString() ?? 0,
                  })}
                </InfoBox>
              </View>
              <TextInput
                control={control}
                label={t("InternalTransfers.TransferPaymentScreen.transactionLimit")}
                name="transactionLimit"
                keyboardType="numeric"
                placeholder={
                  availableGlobalLimit !== null
                    ? `${
                        availableGlobalLimit?.MaxProductTransactionAmount?.toString() +
                        t("InternalTransfers.TransferPaymentScreen.currency")
                      }`
                    : "0" + t("InternalTransfers.TransferPaymentScreen.currency")
                }
                onClear={handleOnTransactionLimitClear}
                onChange={e => handleOnTransactionLimitChange(e)}
                testID="InternalTransfers.TransferPaymentScreen:transactionLimitInput"
              />
              {!errorTriggerTransactionLimit && (
                <Typography.Text style={noteSpacingStyle} color="neutralBase" size="caption1" weight="medium">
                  {t("InternalTransfers.TransferPaymentScreen.transactionLimitNote")}
                </Typography.Text>
              )}
            </Stack>
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderQuickTransferContent = () => {
    return (
      <TouchableWithoutFeedback onPress={handlePressOutsideInput}>
        <View style={contentStyle}>
          {customerLimits && (
            <Stack align="stretch" direction="vertical" style={formContainerStyle}>
              <View style={verticalSpacingStyle}>
                <TextInput
                  control={control}
                  label={t("InternalTransfers.TransferPaymentScreen.transactionLimit")}
                  name="transactionQuickLimit"
                  placeholder={
                    availableGlobalLimit !== null
                      ? `${
                          availableGlobalLimit?.MaxProductTransactionAmount?.toString() +
                          t("InternalTransfers.TransferPaymentScreen.currency")
                        }`
                      : "2500" + t("InternalTransfers.TransferPaymentScreen.currency")
                  }
                  onClear={handleOnTransactionQuickLimitClear}
                  onChange={e => handleOnTransactionQuickLimitChange(e)}
                  keyboardType="numeric"
                  testID="InternalTransfers.TransferPaymentScreen:quickTransactionLimitInput"
                />
                {!errorTriggerTransactionQuickLimit && (
                  <Typography.Text style={noteSpacingStyle} color="neutralBase" size="caption1" weight="medium">
                    {t("InternalTransfers.TransferPaymentScreen.quickTransactionLimitNote")}
                  </Typography.Text>
                )}
              </View>
              <InfoBox variant="primary" borderPosition="start">
                {t("InternalTransfers.TransferPaymentScreen.quickTransactionLimitInfo")}
              </InfoBox>
            </Stack>
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const navTitle = () => {
    let title = "";

    switch (transferTypeProp) {
      case "internalTransfer":
        title = t("InternalTransfers.TransferPaymentScreen.navTitleInternalTransfer");
        break;
      case "LOCAL":
        title = t("InternalTransfers.TransferPaymentScreen.navTitleLocalTransfer");
        break;
      case "SADAD":
        title = t("InternalTransfers.TransferPaymentScreen.navTitleSadadPayment");
        break;
      case "ALIAS":
        title = t("InternalTransfers.TransferPaymentScreen.navTitleQuickTransfer");
        break;
      default:
        title = "";
        break;
    }

    return title;
  };

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <View style={styles.headerSpacing} />
        <NavHeader title={navTitle()} testID="InternalTransfers.TransferPaymentScreen:NavHeader" />
        {transferTypeProp === "internalTransfer" && (
          <View style={container}>
            <TouchableOpacity
              testID="InternalTransfers.TransferPaymentScreen:CroatiaToCroatiaTab"
              style={[tabStyle, tabSelectedColorStyle]}
              onPress={() => handleOnSwitchTab("CRO")}>
              <Typography.Text
                color={selectedTab === "CRO" ? "neutralBase-60" : "neutralBase-10"}
                size="footnote"
                weight="medium">
                {t("InternalTransfers.TransferPaymentScreen.CroaToCroa")}
              </Typography.Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[tabStyle, nonSelectedTabColorStyle]}
              testID="InternalTransfers.TransferPaymentScreen:CroatiaToAlrajhiTab"
              onPress={() => handleOnSwitchTab("ARB")}>
              <Typography.Text
                color={selectedTab === "ARB" ? "neutralBase-60" : "neutralBase-10"}
                size="footnote"
                weight="medium">
                {t("InternalTransfers.TransferPaymentScreen.CroaToAlrajhi")}
              </Typography.Text>
            </TouchableOpacity>
          </View>
        )}
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboard}>
          <ContentContainer isScrollView keyboardShouldPersistTaps="always" style={styles.container}>
            {transferTypeProp === "ALIAS" ? renderQuickTransferContent() : renderTransferContent()}
            <SubmitButton
              control={control}
              onSubmit={handleSubmit(handleOnSubmit)}
              isDisabled={!isFormDirty}
              testID="InternalTransfers.TransferPaymentScreen:TransferPaymentSubmitButton">
              {t("InternalTransfers.TransferPaymentScreen.saveButton")}
            </SubmitButton>
            <Button
              variant="tertiary"
              testID="InternalTransfers.TransferPaymentScreen:TransferPaymentCancelButton"
              onPress={handleOnCancelPress}>
              <Typography.Text color={isFormDirty ? "neutralBase+30" : "neutralBase-10"} size="callout" weight="medium">
                {t("InternalTransfers.TransferPaymentScreen.cancel")}
              </Typography.Text>
            </Button>
          </ContentContainer>
        </KeyboardAvoidingView>
      </Page>
      <NotificationModal
        variant="error"
        title={t("errors.generic.somethingWentWrong")}
        message={t("errors.generic.tryAgainLater")}
        isVisible={isGenericErrorModalVisible}
        onClose={() => {
          setIsGenericErrorModalVisible(false);
          delayTransition(() => navigation.goBack());
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  headerSpacing: {
    paddingTop: 20,
  },
  keyboard: {
    flex: 1,
  },
});
