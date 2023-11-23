import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import { RadioButtonGroup } from "@/components/RadioButton";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { ReasonRadioButton } from "../../components";
import { CardStatus } from "../../types";

interface SelectReportReasonProps {
  cardStatus: CardStatus;
  onContinuePress: (selectedReason: "stolen" | "lost" | "Card fraud") => void;
  onFreezePress: () => void;
}

export default function SelectReportReason({ cardStatus, onContinuePress, onFreezePress }: SelectReportReasonProps) {
  const { t } = useTranslation();
  const [selectedReason, setSelectedReason] = useState<"stolen" | "lost" | "Card fraud">();

  const handleOnContinuePress = () => {
    if (selectedReason === undefined) return;
    onContinuePress(selectedReason);
  };

  const radioGroupStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    marginBottom: theme.spacing["32p"],
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
              testID="CardActions.ReportCardScreen:CardStolenRadioButton"
            />
            <ReasonRadioButton
              title={t("CardActions.ReportCardScreen.SelectReportReason.cardLost")}
              value="lost"
              description={t("CardActions.ReportCardScreen.SelectReportReason.cardLostDescription")}
              testID="CardActions.ReportCardScreen:CardLostRadioButton"
            />
            <ReasonRadioButton
              title={t("CardActions.ReportCardScreen.SelectReportReason.cardDamaged")}
              description={t("CardActions.ReportCardScreen.SelectReportReason.cardDamagedDescription")}
              value="Card fraud"
              testID="CardActions.ReportCardScreen:CardDamagedRadioButton"
            />
          </RadioButtonGroup>
        </View>
      </View>
      <View style={styles.bottom}>
        <View style={styles.button}>
          <Button
            disabled={selectedReason === undefined}
            onPress={handleOnContinuePress}
            testID="CardActions.ReportCardScreen:SelectReasonContinueButton">
            {t("CardActions.ReportCardScreen.SelectReportReason.buttonTitle")}
          </Button>
        </View>
        {cardStatus !== "LOCK" ? (
          <Button variant="tertiary" onPress={onFreezePress} testID="CardActions.ReportCardScreen:FreezeCardButton">
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
