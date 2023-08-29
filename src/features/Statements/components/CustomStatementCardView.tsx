import { format } from "date-fns";
import React from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, ViewStyle } from "react-native";

import {
  ChevronRightIcon,
  InfoCircleIcon,
  RefreshIcon,
  ThreeDotsCircleIcon,
  TickCircleOutlineIcon,
} from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useTheme, useThemeStyles } from "@/theme";

import { StatementStatus } from "../constants";
import { StatementInterface } from "../types";

interface CustomStatementCardViewProps {
  statement: StatementInterface;
  onPressCard: (documentId: string) => void;
  onRetry: (requestId: string, index: number) => void;
  isRetryLoading: boolean;
  index: number;
}

export default function CustomStatementCardView({
  statement,
  onPressCard,
  onRetry,
  isRetryLoading,
  index,
}: CustomStatementCardViewProps) {
  const { t } = useTranslation();
  const appTheme = useTheme();
  const disabled = statement.Status !== StatementStatus.DOWNLOADED && statement.Status !== StatementStatus.GENERATED;

  const dateBadge = (date: string, documentId: string) => {
    return date && documentId ? (
      <Typography.Text size="footnote" weight="medium" style={dateBadgeStyle} color="neutralBase-60">
        {format(new Date(date), "dd MMM yyyy")}
      </Typography.Text>
    ) : null;
  };

  const formatDateRange = (startDateString: string, endDateString: string) => {
    if (startDateString && endDateString) {
      const startDate = new Date(startDateString);
      const endDate = new Date(endDateString);
      const formattedStartDate = format(startDate, "dd MMM yyyy");
      const formattedEndDate = format(endDate, "dd MMM yyyy");
      return `${formattedStartDate} - ${formattedEndDate}`;
    } else {
      return "";
    }
  };

  const renderItemStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["20p"],
    paddingHorizontal: theme.spacing["16p"],
    marginBottom: theme.spacing["8p"],
    borderWidth: 1,
    borderRadius: theme.radii.small,
    borderColor: theme.palette["neutralBase-30"],
  }));

  const dateBadgeStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.neutralBase,
    paddingVertical: theme.spacing["4p"],
    paddingHorizontal: theme.spacing["8p"],
    marginBottom: theme.spacing["8p"],
    alignItems: "center",
  }));

  const renderItemDateStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["4p"],
  }));

  return (
    <Pressable disabled={disabled} onPress={() => onPressCard(statement.DocumentId)}>
      <Stack direction="horizontal" style={renderItemStyle} align="center" justify="space-between">
        <Stack direction="vertical">
          {statement.Status !== StatementStatus.DOWNLOADED ? <StatementStatusView Status={statement.Status} /> : null}
          {statement.Status === StatementStatus.DOWNLOADED
            ? dateBadge(statement.StatementGenerationDate, statement.DocumentId)
            : null}
          <Typography.Text style={renderItemDateStyle} color="neutralBase+30" size="callout" weight="medium">
            {formatDateRange(statement.StatementStartDate, statement.StatementEndDate)}
          </Typography.Text>
          <Typography.Text style={renderItemDateStyle} color="neutralBase-10" size="footnote">
            {t(`Statements.AccessStatements.${statement.StatementLanguage}`)}
          </Typography.Text>
        </Stack>
        {statement.Status === StatementStatus.FAILED ? (
          isRetryLoading ? (
            <ActivityIndicator size="small" />
          ) : (
            <Pressable onPress={() => onRetry(statement.StatementRequestId, index)}>
              <RefreshIcon color={appTheme.theme.palette["neutralBase-20"]} />
            </Pressable>
          )
        ) : !disabled ? (
          <ChevronRightIcon color={appTheme.theme.palette["neutralBase-20"]} />
        ) : null}
      </Stack>
    </Pressable>
  );
}

interface StatementStatusViewProps {
  Status: StatementStatus;
}

const StatementStatusView = ({ Status }: StatementStatusViewProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const statementStatusData = {
    [StatementStatus.GENERATED]: {
      text: t("Statements.AccessStatements.Status.done"),
      icon: <TickCircleOutlineIcon width={20} height={20} />,
      color: theme.palette.successBase,
    },
    [StatementStatus.FAILED]: {
      text: t("Statements.AccessStatements.Status.failed"),
      icon: <InfoCircleIcon color="white" width={20} height={20} />,
      color: theme.palette.errorBase,
    },
    [StatementStatus.PENDING]: {
      text: t("Statements.AccessStatements.Status.inProgress"),
      icon: <ThreeDotsCircleIcon width={20} height={20} />,
      color: theme.palette.interactionBase,
    },
    //As there are 4 statuses adding DOWNLOADED for the type error
    [StatementStatus.DOWNLOADED]: {
      text: "",
      icon: null,
      color: "",
    },
    //To handle any of the status that do not exist adding a default type
    default: {
      text: "",
      icon: null,
      color: "",
    },
  };

  const statusPillStyle = useThemeStyles<ViewStyle>(() => ({
    alignItems: "center",
    marginBottom: theme.spacing["8p"],
    paddingVertical: theme.spacing["4p"],
    paddingHorizontal: theme.spacing["8p"],
    backgroundColor: statementStatusData[Status]?.color || statementStatusData.default.color,
  }));

  return (
    <Stack gap="4p" direction="horizontal" style={statusPillStyle}>
      {statementStatusData[Status]?.icon || statementStatusData.default.icon}
      <Typography.Text color="neutralBase-60" size="caption1">
        {statementStatusData[Status]?.text || statementStatusData.default.text}
      </Typography.Text>
    </Stack>
  );
};
