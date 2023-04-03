import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import { RadioButton, RadioButtonGroup } from "@/components/RadioButton";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface SelectReportReasonProps {
  isLoading: boolean;
  onContinuePress: (selectedReason: string) => void;
  onFreezePress: () => void;
}

export default function SelectReportReason({ isLoading, onContinuePress, onFreezePress }: SelectReportReasonProps) {
  const { t } = useTranslation();
  const [selectedReason, setSelectedReason] = useState<"stolen" | "lost" | "damage">();

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
            <RadioButton label={t("CardActions.ReportCardScreen.SelectReportReason.cardStolen")} value="stolen" />
            <RadioButton label={t("CardActions.ReportCardScreen.SelectReportReason.cardLost")} value="lost" />
            <RadioButton label={t("CardActions.ReportCardScreen.SelectReportReason.cardDamaged")} value="damage" />
          </RadioButtonGroup>
        </View>
      </View>
      <View style={styles.bottom}>
        <Typography.Text color="neutralBase" style={deliveryNote} weight="regular" size="caption1">
          {t("CardActions.ReportCardScreen.SelectReportReason.deliveryFee")}
        </Typography.Text>
        <View style={styles.button}>
          <Button loading={isLoading} disabled={selectedReason === undefined} onPress={handleOnContinuePress}>
            {t("CardActions.ReportCardScreen.SelectReportReason.buttonTitle")}
          </Button>
        </View>
        <Button variant="tertiary" onPress={onFreezePress}>
          {t("CardActions.ReportCardScreen.SelectReportReason.freezeCard")}
        </Button>
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
    flex: 1,
    justifyContent: "space-between",
  },
});
