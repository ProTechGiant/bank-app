import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, ViewStyle } from "react-native";

import { QuestionIcon } from "@/assets/icons";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import NotificationModal from "@/components/NotificationModal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

interface ContextualFAQModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  content: string;
  faqId: string;
  requiresConfirmation?: boolean;
}

export default function ContextualFAQModal({
  visible,
  onClose,
  title,
  content,
  faqId,
  requiresConfirmation,
}: ContextualFAQModalProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [showLeavePageModal, setShowLeavePageModal] = useState(false);

  const navigateToFaq = () => {
    onClose();
    navigation.navigate("FrequentlyAskedQuestions.DetailedScreen", { faqId });
  };

  const handleOnFaqPress = () => {
    if (requiresConfirmation === undefined || requiresConfirmation === false) {
      navigateToFaq();
    } else {
      setShowLeavePageModal(true);
    }
  };

  const handleOnLeaveModalFaqNavigation = () => {
    setShowLeavePageModal(false);
    navigateToFaq();
  };

  const handleOnLeaveModalDismiss = () => {
    setShowLeavePageModal(false);
    onClose();
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["32p"],
  }));

  const iconAndLinkContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["8p"],
    color: theme.palette.primaryBase,
  }));

  const questionMarkIconColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);

  return (
    <>
      {showLeavePageModal ? (
        <NotificationModal
          variant="error"
          title={t("ContextualFAQModal.leavePageModal.title")}
          message={t("ContextualFAQModal.leavePageModal.message")}
          isVisible={showLeavePageModal}
          buttons={{
            primary: (
              <Button onPress={handleOnLeaveModalFaqNavigation}>
                {t("ContextualFAQModal.leavePageModal.leaveButton")}
              </Button>
            ),
            secondary: (
              <Button onPress={handleOnLeaveModalDismiss}>
                {t("ContextualFAQModal.leavePageModal.continueButton")}
              </Button>
            ),
          }}
        />
      ) : (
        <Modal visible={visible} onClose={onClose}>
          <Stack direction="vertical" gap="8p" style={containerStyle}>
            <Typography.Text size="title2" weight="medium">
              {title}
            </Typography.Text>
            <ScrollView alwaysBounceVertical={false}>
              <Typography.Text size="callout" color="neutralBase+10">
                {content}
              </Typography.Text>
            </ScrollView>
            <Pressable onPress={handleOnFaqPress}>
              <Stack direction="horizontal" gap="8p" justify="center" align="center" style={iconAndLinkContainerStyle}>
                <QuestionIcon color={questionMarkIconColor} />
                <Typography.Text size="footnote" color="neutralBase+30" weight="medium" style={styles.linkContentStyle}>
                  {t("ContextualFAQModal.link")}
                </Typography.Text>
              </Stack>
            </Pressable>
          </Stack>
        </Modal>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  linkContentStyle: { textDecorationLine: "underline" },
});
