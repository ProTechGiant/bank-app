import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet } from "react-native";

import { CheckboxInput } from "@/components/Input";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";

interface CheckBoxTermsAndConditionProps {
  caption: string;
  link: string;
  onCheckBoxPress: () => void;
  isChecked: boolean;
  onPress: () => void;
}

export default function CheckBoxTermsAndCondition({
  caption,
  link,
  onCheckBoxPress,
  isChecked,
  onPress,
}: CheckBoxTermsAndConditionProps) {
  const { t } = useTranslation();

  return (
    <Pressable onPress={onCheckBoxPress}>
      <Stack direction="horizontal" gap="8p">
        <CheckboxInput value={isChecked} onChange={onCheckBoxPress} />
        <Stack direction="horizontal" gap="4p">
          <Typography.Text color="neutralBase" size="footnote" weight="regular">
            {caption}{" "}
            <Typography.Text
              color="primaryBase"
              size="footnote"
              weight="medium"
              style={styles.termsAndConditionsLink}
              onPress={onPress}>
              {link}
            </Typography.Text>
          </Typography.Text>
          {I18nManager.isRTL ? (
            <Typography.Text color="neutralBase" size="footnote" weight="regular">
              {t("MutualFund.SubscriptionScreen.extraConditionsCaption")}
            </Typography.Text>
          ) : null}
        </Stack>
      </Stack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  termsAndConditionsLink: {
    textDecorationLine: "underline",
  },
});
