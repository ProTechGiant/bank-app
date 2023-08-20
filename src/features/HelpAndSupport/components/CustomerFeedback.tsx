import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Typography from "@/components/Typography";

import CustomStarRating from "./CustomStarRating";

interface CustomerFeedbackProps {
  visible: boolean;
  onSkip: () => void;
}

export default function CustomerFeedBack({ visible, onSkip }: CustomerFeedbackProps) {
  const { t } = useTranslation();
  const [feedbackRating, setFeedbackRating] = useState<number>(0);

  const handleOnChangeRating = (rate: number) => {
    setFeedbackRating(rate);
  };

  const handleOnSubmitRating = () => {
    //TODO: Send Feedback using API
  };

  return (
    <Modal visible={visible}>
      <View style={styles.page}>
        <View style={styles.container}>
          <View>
            <Typography.Text size="title3" weight="medium" align="center">
              {t("CustmerFeedBack.label")}
            </Typography.Text>
            <CustomStarRating rate={feedbackRating} onChangeRating={handleOnChangeRating} />
          </View>
          <View>
            <Button disabled={feedbackRating === 0} onPress={handleOnSubmitRating}>
              {t("CustmerFeedBack.Buttons.submitRating")}
            </Button>
            <Button onPress={onSkip} variant="tertiary">
              {t("CustmerFeedBack.Buttons.skip")}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { height: "65%", justifyContent: "space-between" },
  page: {
    height: "95%",
    justifyContent: "center",
  },
});
