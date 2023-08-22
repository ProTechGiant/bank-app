import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import Typography from "@/components/Typography";

interface HeaderTextProps {
  categoryName: string;
}

export default function HeaderText({ categoryName }: HeaderTextProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Typography.Text size="callout" weight="regular">
        {t("HelpAndSupport.ChatScreen.headerText")}
      </Typography.Text>
      <Typography.Text size="callout" weight="semiBold">
        {" "}
        {categoryName}
      </Typography.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
});
