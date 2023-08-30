import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo, useState } from "react";
import { useController, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as yup from "yup";

import ContentContainer from "@/components/ContentContainer";
import SubmitButton from "@/components/Form/SubmitButton";
import NotificationModal from "@/components/NotificationModal";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import * as SupportIcons from "../assets/icons";
import { LiveChatScreenHeader } from "../components";
import ReasonOptionSupportSection from "../components/ReasonOptionSupportSection";
import { useGetAwaitTimer, useGetReasonsOptions, useStartChat } from "../hooks/query-hooks";
import { ReasonOptionIconLookupProps, SubOptionProps } from "../types";

const iconLookup: ReasonOptionIconLookupProps = {
  1: <SupportIcons.FraudIcon />,
  2: <SupportIcons.InquiryIcon />,
  3: <SupportIcons.ComplaintIcon />,
};

export default function LiveChatScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { data: reasonsOption } = useGetReasonsOptions();
  const startChat = useStartChat();
  const awaitTimer = useGetAwaitTimer();

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        SubOptionId: yup.string().required(t("CardActions.SetTemporaryAddressScreen.form.city.validation.required")),
      }),
    [t]
  );

  const { control, handleSubmit } = useForm<SubOptionProps>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      SubOptionId: "",
    },
  });

  const {
    field: { onChange },
  } = useController({
    control,
    name: "SubOptionId",
    defaultValue: "",
  });

  const [enquiryType, setEnquiryType] = useState<string>("");
  const [subEnquiryType, setSubEnquiryType] = useState<string>("");

  const [isError, setIsError] = useState(false);
  // countExpandedSupportSection used for count how many SupportSection Component are Expanding
  const [countExpandedSupportSection, setCountExpandedSupportSection] = useState<number>(0);
  /*
    if countExpandedSupportSection > 0
    that's mean the LiveChatScreenHeader will hide (isHide = true)
    else LiveChatScreenHeader will appear (isHide = false)
  */
  const [isHeaderHide, setIsHeaderHide] = useState(false);

  const handleOnSubmit = async (value: SubOptionProps) => {
    try {
      const chatResponse = await startChat.mutateAsync({ ReasonCode: value.SubOptionId });
      const awaitTimerResponse = await awaitTimer.mutateAsync();

      navigation.navigate("HelpAndSupport.ChatScreen", {
        chatResponse: chatResponse,
        awaitTimeData: awaitTimerResponse,
        enquiryType: enquiryType,
        subEnquiryType: subEnquiryType,
      });
    } catch (error) {
      warn(" init chat falied", JSON.stringify(error));
    }
  };

  const updateExpandedSupportSectionCount = (value: number) => {
    setCountExpandedSupportSection(c => c + value);
  };

  useEffect(() => {
    setIsHeaderHide(countExpandedSupportSection > 0);
  }, [countExpandedSupportSection]);

  const submitButtonContainer = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["64p"],
    marginBottom: theme.spacing["32p"],
    justifyContent: "flex-end",
    flex: 1,
  }));

  const paddingScrollViewStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
  }));
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <LiveChatScreenHeader isHide={isHeaderHide} />
        <ContentContainer isScrollView style={paddingScrollViewStyle}>
          <View>
            {reasonsOption &&
              reasonsOption.Reasons.map(reason => {
                return (
                  <ReasonOptionSupportSection
                    key={reason.Name}
                    name={reason.Name}
                    description={reason.Description}
                    subOptions={reason.SubOptions}
                    icon={iconLookup[reason.Id]}
                    onChange={onChange}
                    enquiryType={enquiryType}
                    setEnquiryType={setEnquiryType}
                    setSubEnquiryType={setSubEnquiryType}
                    updateExpandedSupportSectionCount={updateExpandedSupportSectionCount}
                  />
                );
              })}
          </View>
          <View style={submitButtonContainer}>
            <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
              {t("HelpAndSupport.LiveChatScreen.submitButton")}
            </SubmitButton>
          </View>
        </ContentContainer>
      </View>
      <NotificationModal
        title={t("HelpAndSupport.LiveChatScreen.error.title")}
        message={t("HelpAndSupport.LiveChatScreen.error.message")}
        isVisible={isError}
        variant="error"
        onClose={() => setIsError(false)}
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
});
