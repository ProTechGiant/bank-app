import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { warn } from "@/logger";

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

  return (
    <Modal visible={isVisible} style={styles.modelContainer}>
      <Stack direction="vertical" align="stretch">
        <Stack direction="vertical" align="center" gap="24p" style={styles.ratingSection}>
          <Typography.Text size="title3" weight="medium" align="center">
            {t("CustomerFeedbackModal.label")}
          </Typography.Text>
          <CustomStarRating rate={feedbackRating} onChangeRating={handleOnChangeRating} />
        </Stack>
        <Button
          loading={submitCustomerFeedback.isLoading}
          disabled={feedbackRating === 0}
          onPress={() => {
            handleOnSubmitRating(feedbackRating);
          }}>
          {t("CustomerFeedbackModal.Buttons.submitRating")}
        </Button>
        <Button onPress={onSkip} variant="tertiary">
          {t("CustomerFeedbackModal.Buttons.skip")}
        </Button>
      </Stack>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modelContainer: {
    height: "98%",
    justifyContent: "center",
  },
  ratingSection: {
    marginBottom: 155,
  },
});
