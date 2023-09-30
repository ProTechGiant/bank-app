import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet } from "react-native";

import { CheckboxInput } from "@/components/Input";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";

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
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <Pressable onPress={onCheckBoxPress}>
      <Stack direction="horizontal" gap="8p">
        <CheckboxInput value={isChecked} onChange={onCheckBoxPress} />
        <Stack direction="horizontal" gap="4p">
          <Typography.Text color="neutralBase" size="footnote" weight="regular">
            {conditionsCaption}&nbsp;
            <Typography.Text
              color="primaryBase-40"
              size="footnote"
              weight="medium"
              style={styles.termsAndConditionsLink}
              onPress={() => {
                navigation.navigate("GoalGetter.TermsAndConditionsScreen");
              }}>
              {conditionsLink}
            </Typography.Text>
          </Typography.Text>
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
  termsAndConditionsLink: {
    textDecorationLine: "underline",
  },
});
