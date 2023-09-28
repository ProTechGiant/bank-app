import { cloneElement } from "react";
import { I18nManager, Pressable, StyleSheet, View } from "react-native";
import { SvgProps } from "react-native-svg";

import { ChevronRightIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface PaymentOptionProps {
  onPress: () => void;
  icon?: React.ReactElement<SvgProps>;
  title: string;
  helperText: string;
  testID?: string;
}

export default function PaymentOption({ onPress, icon, title, helperText, testID }: PaymentOptionProps) {
  const iconColor = useThemeStyles(t => t.palette.complimentBase);
  const arrowColor = useThemeStyles(t => t.palette["neutralBase-20"]);

  return (
    <Pressable onPress={onPress} testID={testID}>
      <Stack direction="horizontal" gap="16p" align="center" justify="space-between">
        {icon !== undefined && cloneElement(icon, { color: iconColor })}
        <Stack direction="vertical" style={styles.expandText}>
          <Typography.Text size="callout" weight="medium" color="neutralBase+30">
            {title}
          </Typography.Text>
          <Typography.Text size="footnote" color="neutralBase">
            {helperText}
          </Typography.Text>
        </Stack>
        <View style={styles.chevronContainer}>
          <ChevronRightIcon color={arrowColor} />
        </View>
      </Stack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chevronContainer: {
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
  expandText: {
    flex: 1,
  },
});
