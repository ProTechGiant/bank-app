import React from "react";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import Pill from "@/components/Pill";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { StatementLanguageTypes } from "../constants";

interface FilterButtonProps {
  lable: StatementLanguageTypes;
  onClearFilter: () => void;
}

export default function FilterButton({ lable, onClearFilter }: FilterButtonProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  return (
    <Stack style={containerStyle} direction="horizontal" align="center" gap="8p">
      <Typography.Text size="footnote" color="neutralBase">
        {t("Statements.AccessStatements.filteredByText")}
      </Typography.Text>
      <Pill isActive={true} onPress={onClearFilter}>
        {lable}
      </Pill>
    </Stack>
  );
}
