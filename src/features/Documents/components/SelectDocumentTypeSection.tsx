import React from "react";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import CardMembershipIcon from "../assets/card-membership.svg";
import SummarizeIcon from "../assets/summarize.svg";
import { DocumentType } from "../constants";
import DocumentCard from "./DocumentCard";

interface SelectDocumentTypeSectionInterface {
  selectedDocumentType: DocumentType | null;
  onSelectDocumentType: (selectedDocumentType: DocumentType) => void;
}

export default function SelectDocumentTypeSection({
  selectedDocumentType,
  onSelectDocumentType,
}: SelectDocumentTypeSectionInterface) {
  const { t } = useTranslation();

  const selectDocumentTypeSectionStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["20p"],
    marginTop: theme.spacing["24p"],
    marginBottom: theme.spacing["24p"],
  }));

  return (
    <Stack direction="vertical" align="stretch" style={selectDocumentTypeSectionStyle} gap="16p">
      <Stack direction="vertical" gap="8p">
        <Typography.Text size="title1" weight="medium" color="neutralBase+30">
          {t("Documents.RequestDocumentScreen.letsGo")}
        </Typography.Text>
        <Typography.Text size="callout" weight="medium" color="neutralBase+10">
          {t("Documents.RequestDocumentScreen.chooseDocumentType")}
        </Typography.Text>
      </Stack>
      <Stack direction="vertical" align="stretch" gap="8p">
        <DocumentCard
          title={t("Documents.RequestDocumentScreen.ibanLetter")}
          description={t("Documents.RequestDocumentScreen.ibanLetterDesc")}
          icon={<SummarizeIcon />}
          isSelected={selectedDocumentType === DocumentType.IBAN_LETTER}
          onSelect={() => onSelectDocumentType(DocumentType.IBAN_LETTER)}
        />
        <DocumentCard
          title={t("Documents.RequestDocumentScreen.bankCertificate")}
          description={t("Documents.RequestDocumentScreen.bankCertificateDesc")}
          icon={<CardMembershipIcon />}
          isSelected={selectedDocumentType === DocumentType.BANK_CERTIFICATE}
          onSelect={() => onSelectDocumentType(DocumentType.BANK_CERTIFICATE)}
        />
      </Stack>
    </Stack>
  );
}
