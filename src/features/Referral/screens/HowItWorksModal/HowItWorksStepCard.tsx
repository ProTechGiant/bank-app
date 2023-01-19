import { StyleSheet, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface HowItWorksStepCardProps {
  step: number;
  text: string;
}

export default function HowItWorksStepCard({ step, text }: HowItWorksStepCardProps) {
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["neutralBase-50"],
      borderRadius: theme.radii.extraSmall,
      flexDirection: "row",
      padding: theme.spacing.medium,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      minHeight: 64,
      alignItems: "center",
      flex: 1,
    }),
    []
  );
  const numberStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["tintBase"],
      minWidth: 32,
      minHeight: 32,
      marginRight: theme.spacing.small,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: theme.radii.extraSmall,
    }),
    []
  );
  return (
    <View style={container}>
      <View style={numberStyle}>
        <Typography.Text color="neutralBase-50" size="callout" weight="semiBold">
          {step}
        </Typography.Text>
      </View>
      <View style={styles.textWrapper}>
        <Typography.Text color="interactionBase+30" weight="medium" size="callout">
          {text}
        </Typography.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textWrapper: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
