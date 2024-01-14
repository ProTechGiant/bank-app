import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, ViewStyle } from "react-native";

import { CheckboxInput } from "@/components/Input";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface TermsAndConditionsProps {
  extraConditionsCaption?: string;
  conditionsCaption: string;
  conditionsLink: string;
  onCheckBoxPress: () => void;
  isChecked: boolean;
  onPress?: () => void;
}

export default function TermsAndConditions({
  extraConditionsCaption,
  conditionsCaption,
  conditionsLink,
  onCheckBoxPress,
  isChecked,
  onPress,
}: TermsAndConditionsProps) {
  const { t } = useTranslation();

  const paddingHorizontalValue = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["12p"],
  }));

  return (
    <Pressable onPress={onCheckBoxPress} testID="MutualFund.RiskAppetite-TermsAndConditions:Pressable">
      <Stack direction="horizontal" style={paddingHorizontalValue} testID="MutualFund.RiskAppetite-TermsAndConditions">
        <CheckboxInput
          value={isChecked}
          onChange={onCheckBoxPress}
          testID="MutualFund.RiskAppetite-TermsAndConditions:CheckboxInput"
        />
        <Stack direction="horizontal" flex={1} testID="MutualFund.RiskAppetite-TermsAndConditions">
          <Typography.Text color="neutralBase" size="footnote" weight="regular" style={{ flex: 1 }}>
            {conditionsCaption}&nbsp;
            <Typography.Text
              color="neutralBase"
              size="footnote"
              weight="medium"
              style={styles.termsAndConditionsLink}
              onPress={onPress}>
              {conditionsLink}
            </Typography.Text>
          </Typography.Text>
          {I18nManager.isRTL ? (
            <Typography.Text color="neutralBase" size="footnote" weight="regular">
              {extraConditionsCaption
                ? extraConditionsCaption
                : t("GoalGetter.GoalReviewScreen.extraConditionsCaption")}
            </Typography.Text>
          ) : null}
        </Stack>
      </Stack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  termsAndConditionsLink: {
    flexWrap: "wrap",
    textDecorationLine: "underline",
  },
});
