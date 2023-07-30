import React from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

interface CardButtonProps {
  label: string;
  text: string;
  icon?: React.ReactNode;
  amount?: string;
  onPress: () => void;
}

export default function CardButton({ label, text, icon, amount, onPress }: CardButtonProps) {
  const { t } = useTranslation();

  const button = useThemeStyles<ViewStyle>(theme => ({
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing["12p"],
    paddingHorizontal: theme.spacing["16p"],
    height: 64,
    borderRadius: theme.radii.extraSmall,
  }));

  const marginsStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  const amountStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingLeft: theme.spacing["8p"],
    flexDirection: "row",
    alignItems: "center",
  }));

  const chevronColor = useThemeStyles(theme => theme.palette["neutralBase-20"]);

  return (
    <Pressable onPress={onPress} style={marginsStyle}>
      <View style={button}>
        <View style={styles.iconContainer}>
          {icon}
          <View>
            <Typography.Text color="neutralBase+30" size="callout" weight="medium">
              {label}
            </Typography.Text>
            <Typography.Text color="neutralBase" size="footnote" weight="regular">
              {text}
            </Typography.Text>
          </View>
        </View>
        <View style={amountStyle}>
          {amount ? (
            <View>
              <Typography.Text size="callout" weight="regular">
                {formatCurrency(Number(amount))} {t("Currency.sar")}
              </Typography.Text>
            </View>
          ) : null}

          <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
            <ChevronRightIcon color={chevronColor} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
