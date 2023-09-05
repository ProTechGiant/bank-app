import { differenceInHours, format, parseISO } from "date-fns";
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
import { iconMapping } from "@/utils/icon-mapping";

import { DocumentStatus } from "../constants";
import { DocumentInterface } from "../types";
import convertUTCDateToLocalDate from "../utils/convert-utc-date-to-local-date";

interface DocumentCardViewProps {
  document: DocumentInterface;
  onPressCard: (documentId: string) => void;
  onRetry: (requestId: string, index: number) => void;
  isRetryLoading: boolean;
  index: number;
}

export default function DocumentCardView({
  document,
  onPressCard,
  onRetry,
  isRetryLoading,
  index,
}: DocumentCardViewProps) {
  const { t } = useTranslation();
  const appTheme = useTheme();
  const disabled = document.Status !== DocumentStatus.Downloaded && document.Status !== DocumentStatus.Approved;

  const dateFormatter = (date: string) => {
    return format(parseISO(date), "dd MMM yyyy");
  };

  const documentExpiryCountDown = (backendDate: string) => {
    const currentDate = new Date();
    const localTimeZone = convertUTCDateToLocalDate(backendDate);
    const hoursDifference = differenceInHours(currentDate, localTimeZone);
    if (hoursDifference > 24) {
      return 0;
    }
    const remainingHours = 24 - hoursDifference;
    return Math.max(0, remainingHours);
  };

  const handleGetSubTitle = (status: DocumentInterface) => {
    switch (status.Status) {
      case DocumentStatus.Downloaded:
      case DocumentStatus.Approved:
        return t("Documents.DocumentListScreen.SubTitle.validUntil", {
          date: document?.ExpiryDateTime ? dateFormatter(document.ExpiryDateTime) : "",
        });
      case DocumentStatus.Pending:
        return t("Documents.DocumentListScreen.SubTitle.requestedOn", {
          date: document.CreateDateTime ? dateFormatter(document.CreateDateTime) : "",
        });
      case DocumentStatus.Failed:
        return t("Documents.DocumentListScreen.SubTitle.willAppear", {
          hours: documentExpiryCountDown(document.DocumentStatusUpdateDateTime),
        });
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

  const renderItemDateStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["4p"],
  }));

  const leftSideContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    columnGap: theme.spacing["16p"],
  }));

  return (
    <Pressable disabled={disabled} onPress={() => onPressCard(document.DocumentId)}>
      <Stack direction="horizontal" style={renderItemStyle} align="center" justify="space-between">
        <Stack style={leftSideContainerStyle} direction="horizontal">
          {iconMapping.adhocDocuments[document.Category]}
          <Stack direction="vertical">
            {document.Status !== DocumentStatus.Downloaded ? <DocumentStatusView status={document.Status} /> : null}
            <Typography.Text style={renderItemDateStyle} color="neutralBase+30" size="callout" weight="medium">
              {t(`Documents.DocumentListScreen.Category.${document.Category}`)}
            </Typography.Text>
            <Typography.Text style={renderItemDateStyle} color="neutralBase-10" size="footnote">
              {handleGetSubTitle(document)}
            </Typography.Text>
          </Stack>
        </Stack>
        {document.Status === DocumentStatus.Failed ? (
          isRetryLoading ? (
            <ActivityIndicator color={appTheme.theme.palette["neutralBase-20"]} size="small" />
          ) : (
            <Pressable onPress={() => onRetry(document.AdhocDocRequestId, index)}>
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

interface DocumentStatusViewProps {
  status: DocumentStatus;
}

const DocumentStatusView = ({ status }: DocumentStatusViewProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const documentStatusData = {
    [DocumentStatus.Approved]: {
      text: t("Documents.DocumentListScreen.Status.approved"),
      icon: <TickCircleOutlineIcon width={20} height={20} />,
      color: theme.palette.successBase,
    },
    [DocumentStatus.Failed]: {
      text: t("Documents.DocumentListScreen.Status.failed"),
      icon: <InfoCircleIcon color="white" width={20} height={20} />,
      color: theme.palette.errorBase,
    },
    [DocumentStatus.Pending]: {
      text: t("Documents.DocumentListScreen.Status.pending"),
      icon: <ThreeDotsCircleIcon width={20} height={20} />,
      color: theme.palette.interactionBase,
    },
    [DocumentStatus.Downloaded]: {
      text: "",
      icon: null,
      color: "",
    },
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
  }));

  const backgroundColor = documentStatusData[status]?.color || documentStatusData.default.color;

  return (
    <Stack gap="4p" direction="horizontal" style={[statusPillStyle, { backgroundColor }]}>
      {documentStatusData[status]?.icon || documentStatusData.default.icon}
      <Typography.Text color="neutralBase-60" size="caption1">
        {documentStatusData[status]?.text || documentStatusData.default.text}
      </Typography.Text>
    </Stack>
  );
};
