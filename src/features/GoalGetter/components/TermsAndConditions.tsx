import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet } from "react-native";

import { CheckboxInput } from "@/components/Input";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";

interface TermsAndConditionsProps {
  conditionsCaption: string;
  conditionsLink: string;
  onCheckBoxPress: () => void;
  isChecked: boolean;
}

export default function TermsAndConditions({
  conditionsCaption,
  conditionsLink,
  onCheckBoxPress,
  isChecked,
}: TermsAndConditionsProps) {
  const { t } = useTranslation();

  return (
    <Pressable onPress={onCheckBoxPress} style={styles.stackStyle}>
      <Stack direction="horizontal" gap="8p">
        <CheckboxInput value={isChecked} onChange={onCheckBoxPress} />
        <Stack direction="horizontal" gap="4p">
          <Typography.Text color="neutralBase" size="footnote" weight="regular">
            {conditionsCaption}
          </Typography.Text>
          <Pressable
            onPress={() => {
              /*TODO - add navigation here to terms and condition screen when it available */
            }}>
            <Typography.Text
              color="primaryBase-40"
              size="footnote"
              weight="medium"
              style={styles.termsAndConditionsLink}>
              {conditionsLink}
            </Typography.Text>
          </Pressable>

          {I18nManager.isRTL ? (
            <Typography.Text color="neutralBase" size="footnote" weight="regular">
              {t("GoalGetter.GoalReviewScreen.extraConditionsCaption")}
            </Typography.Text>
          ) : null}
        </Stack>
      </Stack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  stackStyle: {
    marginTop: 158,
  },
  termsAndConditionsLink: {
    textDecorationLine: "underline",
  },
});
