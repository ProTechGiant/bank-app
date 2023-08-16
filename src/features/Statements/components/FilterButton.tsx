import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ViewStyle } from "react-native";

import { CloseIcon } from "@/assets/icons";
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

  const pillStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: theme.spacing["4p"],
    borderWidth: 2,
    borderRadius: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    columnGap: theme.spacing["8p"],
  }));

  return (
    <Stack style={containerStyle} direction="horizontal" align="center" gap="8p">
      <Typography.Text size="footnote" color="neutralBase">
        {t("Statements.AccessStatements.filteredByText")}
      </Typography.Text>
      <Pressable style={pillStyle} onPress={onClearFilter}>
        <Typography.Text weight="medium" size="footnote" color="neutralBase+30">
          {lable}
        </Typography.Text>
        <CloseIcon width={14} color="#2E2E2E" />
      </Pressable>
    </Stack>
  );
}
