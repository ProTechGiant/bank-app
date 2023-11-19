import { useTranslation } from "react-i18next";
import { Pressable, Text, TextStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { CheckboxInput } from "@/components/Input";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

interface NeraTermsAndConditionProps {
  hasAgreedToTerms: boolean;
  setHasAgreedToTerms: (value: boolean) => void;
}

export default function NeraTermsAndCondition({ hasAgreedToTerms, setHasAgreedToTerms }: NeraTermsAndConditionProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const termsAndConditionsTextStyle = useThemeStyles<TextStyle>(theme => ({
    textDecorationLine: "underline",
    marginLeft: theme.spacing["4p"],
    color: "#FF523D",
    fontSize: theme.typography.text.sizes.footnote,
    fontWeight: "500",
  }));

  return (
    <Stack direction="horizontal">
      <CheckboxInput
        isEditable={true}
        label={t("AllInOneCard.myCurrenciesScreens.agree")}
        value={hasAgreedToTerms}
        onChange={() => setHasAgreedToTerms(!hasAgreedToTerms)}
      />

      <Pressable
        onPress={() => {
          navigation.navigate("AllInOneCard.TermsAndConditions");
        }}>
        <Text style={termsAndConditionsTextStyle}>{t("AllInOneCard.myCurrenciesScreens.termsAndConditions")}</Text>
      </Pressable>

      <Typography.Text size="footnote"> {t("AllInOneCard.myCurrenciesScreens.ofCroatia")}</Typography.Text>
    </Stack>
  );
}
