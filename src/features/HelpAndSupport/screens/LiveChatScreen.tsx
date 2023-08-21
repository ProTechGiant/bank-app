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
import { useThemeStyles } from "@/theme";

import * as SupportIcons from "../assets/icons";
import { LiveChatScreenHeader } from "../components";
import SupportSection from "../components/SupportSection";
import { SUPPORTS } from "../mockSupport";

interface RadioButtonProps {
  EnquiryType: string;
}

interface TitleToIconMap {
  [key: string]: React.ReactElement;
}

const titleToIcon: TitleToIconMap = {
  Fraud: <SupportIcons.FraudIcon />,
  Inquiry: <SupportIcons.InquiryIcon />,
  Complaint: <SupportIcons.ComplaintIcon />,
};

export default function LiveChatScreen() {
  const { t } = useTranslation();

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        EnquiryType: yup.string().required(t("CardActions.SetTemporaryAddressScreen.form.city.validation.required")),
      }),
    [t]
  );

  const { control, handleSubmit } = useForm<RadioButtonProps>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      EnquiryType: "",
    },
  });

  const {
    field: { onChange },
  } = useController({
    control,
    name: "EnquiryType",
    defaultValue: "",
  });

  const [enquiryType, setEnquiryType] = useState<string>("");
  const [isError, setIsError] = useState(false);
  // countExpandedSupportSection used for count how many SupportSection Component are Expanding
  const [countExpandedSupportSection, setCountExpandedSupportSection] = useState<number>(0);
  /*
    if countExpandedSupportSection > 0
    that's mean the LiveChatScreenHeader will hide (isHide = true)
    else LiveChatScreenHeader will appear (isHide = false)
  */
  const [isHeaderHide, setIsHeaderHide] = useState(false);

  const handleOnSubmit = (values: RadioButtonProps) => {
    if (values) {
      // *TODO - Open live chat
    }

    setIsError(true);
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

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <LiveChatScreenHeader isHide={isHeaderHide} />
        <ContentContainer style={styles.contentContainer}>
          <ContentContainer isScrollView style={styles.ScrollContainer}>
            <View>
              {SUPPORTS &&
                SUPPORTS.map(el => {
                  const iconComponent = titleToIcon[el.title];
                  return (
                    <SupportSection
                      key={el.title}
                      title={el.title}
                      description={el.description}
                      reasonsOptions={el.reasonsOptions}
                      icon={iconComponent}
                      onChange={onChange}
                      enquiryType={enquiryType}
                      setEnquiryType={setEnquiryType}
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
  ScrollContainer: { paddingHorizontal: 0 },
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  contentContainer: { flex: 1, paddingVertical: 0 },
});
