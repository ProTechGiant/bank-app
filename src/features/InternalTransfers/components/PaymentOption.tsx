import { cloneElement } from "react";
import { Pressable, StyleSheet } from "react-native";
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
}

export default function PaymentOption({ onPress, icon, title, helperText }: PaymentOptionProps) {
  const iconColor = useThemeStyles(t => t.palette.primaryBase);

  const arrowColor = useThemeStyles(t => t.palette["neutralBase-20"]);

  return (
    <Pressable onPress={onPress}>
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
        <ChevronRightIcon color={arrowColor} />
      </Stack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  expandText: {
    flex: 1,
  },
});
