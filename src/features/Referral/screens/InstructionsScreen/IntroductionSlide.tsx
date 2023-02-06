import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import { GiftIcon, InviteIcon, ReferraslIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface IntroductionSlideProps {
  step: number;
}

export default function IntroductionSlide({ step }: IntroductionSlideProps) {
  const subTextStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginTop: theme.spacing["16p"],
      textAlign: "center",
    }),
    []
  );
  const iconWrapperStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["neutralBase-50"],
      width: 64,
      height: 64,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 32,
    }),
    []
  );
  const TitleStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginTop: theme.spacing["20p"],
      textAlign: "center",
    }),
    []
  );

  const { height: iconHeight, width: iconWidth } = useThemeStyles(theme => theme.iconDimensions.referralInstruction);
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={iconWrapperStyle}>
          {step === 1 ? (
            <InviteIcon width={iconWidth} height={iconHeight} />
          ) : step === 2 ? (
            <ReferraslIcon width={iconWidth} height={iconHeight} />
          ) : (
            <GiftIcon width={iconWidth} height={iconHeight} />
          )}
        </View>
        <Typography.Text color="neutralBase-50" size="large" weight="bold" style={TitleStyle}>
          {t(`Referral.InstructionsScreen.${step}.title`)}
        </Typography.Text>
        <Typography.Text color="neutralBase-20" size="callout" style={subTextStyle}>
          {t(`Referral.InstructionsScreen.${step}.subText`)}
        </Typography.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  contentWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
});
