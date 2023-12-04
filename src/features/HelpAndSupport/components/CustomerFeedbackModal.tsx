import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import { useThemeStyles } from "@/theme";

import { FeedBackIcon } from "../assets/icons";
import { useSubmitCustomerFeedback } from "../hooks/query-hooks";
import CustomStarRating from "./CustomStarRating";

interface CustomerFeedbackProps {
  isVisible: boolean;
  onSkip: () => void;
  onSubmit: () => void;
}

export default function CustomerFeedbackModal({ isVisible, onSkip, onSubmit }: CustomerFeedbackProps) {
  const { t } = useTranslation();
  const submitCustomerFeedback = useSubmitCustomerFeedback();

  const [feedbackRating, setFeedbackRating] = useState<number>(0);

  const handleOnChangeRating = (rate: number) => {
    setFeedbackRating(rate);
  };

  const handleOnSubmitRating = async (values: number) => {
    try {
      await submitCustomerFeedback.mutateAsync(values);
      onSubmit();
    } catch (error) {
      warn("Customer Feedback", `Could not submit feedback : ${(error as Error).message}`);
    }
  };
  const modelContainer = useThemeStyles<ViewStyle>(theme => ({
    height: "98%",
    justifyContent: "center",
    backgroundColor: theme.palette["neutralBase+30"],
  }));

  const iconStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["64p"],
    alignItems: "center",
    marginTop: 96,
  }));
  const feedBackText = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["32p"],
  }));
  const ratingSection = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["32p"],
  }));
  return (
    <Modal visible={isVisible} style={modelContainer}>
      <View style={iconStyle}>
        <FeedBackIcon />
      </View>
      <Stack direction="vertical" align="stretch" style={feedBackText}>
        <Stack direction="vertical" align="center" gap="24p" style={ratingSection}>
          <Typography.Text size="title3" weight="medium" align="center" color="neutralBase-60">
            {t("CustomerFeedbackModal.label")}
          </Typography.Text>
          <CustomStarRating rate={feedbackRating} onChangeRating={handleOnChangeRating} />
        </Stack>
        <Button
          color="dark"
          loading={submitCustomerFeedback.isLoading}
          disabled={feedbackRating === 0}
          onPress={() => {
            handleOnSubmitRating(feedbackRating);
          }}>
          {t("CustomerFeedbackModal.Buttons.submitRating")}
        </Button>
        <Button onPress={onSkip} variant="primary">
          {t("CustomerFeedbackModal.Buttons.skip")}
        </Button>
      </Stack>
    </Modal>
  );
}
