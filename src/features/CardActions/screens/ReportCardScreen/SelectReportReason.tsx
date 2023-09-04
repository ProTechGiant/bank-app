import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import { RadioButtonGroup } from "@/components/RadioButton";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { ReasonRadioButton } from "../../components";
import { CardStatus } from "../../types";

interface SelectReportReasonProps {
  cardStatus: CardStatus;
  onContinuePress: (selectedReason: "stolen" | "lost" | "damaged") => void;
  onFreezePress: () => void;
}

export default function SelectReportReason({ cardStatus, onContinuePress, onFreezePress }: SelectReportReasonProps) {
  const { t } = useTranslation();
  const [selectedReason, setSelectedReason] = useState<"stolen" | "lost" | "damaged">();

  const handleOnContinuePress = () => {
    if (selectedReason === undefined) return;
    onContinuePress(selectedReason);
  };

  const deliveryNote = useThemeStyles<TextStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
    marginTop: theme.spacing["32p"],
  }));

  const radioGroupStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
  }));

  const descriptionStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));

  return (
    <ContentContainer isScrollView style={styles.content}>
      <View>
        <Typography.Text color="neutralBase+30" weight="semiBold" size="title1">
          {t("CardActions.ReportCardScreen.SelectReportReason.navTitle")}
        </Typography.Text>
        <Typography.Text color="neutralBase+30" style={descriptionStyle} weight="regular" size="callout">
          {t("CardActions.ReportCardScreen.SelectReportReason.description")}
        </Typography.Text>
        <View style={radioGroupStyle}>
          <RadioButtonGroup onPress={value => setSelectedReason(value)} value={selectedReason}>
            <ReasonRadioButton
              title={t("CardActions.ReportCardScreen.SelectReportReason.cardStolen")}
              description={t("CardActions.ReportCardScreen.SelectReportReason.cardStolenDescription")}
              value="stolen"
            />
            <ReasonRadioButton
              title={t("CardActions.ReportCardScreen.SelectReportReason.cardLost")}
              value="lost"
              description={t("CardActions.ReportCardScreen.SelectReportReason.cardLostDescription")}
            />
            <ReasonRadioButton
              title={t("CardActions.ReportCardScreen.SelectReportReason.cardDamaged")}
              description={t("CardActions.ReportCardScreen.SelectReportReason.cardDamagedDescription")}
              value="damaged"
            />
          </RadioButtonGroup>
        </View>
      </View>
      <View style={styles.bottom}>
        <Typography.Text color="neutralBase" style={deliveryNote} weight="regular" size="caption1">
          {t("CardActions.ReportCardScreen.SelectReportReason.deliveryFee")}
        </Typography.Text>
        <View style={styles.button}>
          <Button disabled={selectedReason === undefined} onPress={handleOnContinuePress}>
            {t("CardActions.ReportCardScreen.SelectReportReason.buttonTitle")}
          </Button>
        </View>
        {cardStatus !== "freeze" ? (
          <Button variant="tertiary" onPress={onFreezePress}>
            {t("CardActions.ReportCardScreen.SelectReportReason.freezeCard")}
          </Button>
        ) : null}
      </View>
    </ContentContainer>
  );
}

const styles = StyleSheet.create({
  bottom: {
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    alignSelf: "stretch",
    marginBottom: 15,
  },
  content: {
    flexGrow: 1,
  },
});
