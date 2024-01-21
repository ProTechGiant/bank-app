import React from "react";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import CardMembershipIcon from "../assets/card-membership.svg";
import SummarizeIcon from "../assets/summarize.svg";
import TaxInvoiceIcon from "../assets/tax-invoice.svg";
import { DocumentType } from "../constants";
import DocumentCard from "./DocumentCard";

export default function SelectDocumentTypeSection() {
  const { t } = useTranslation();

  const navigation = useNavigation();

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
          onSelect={() =>
            navigation.navigate("Documents.RequestDocumentTypeScreen", {
              documentType: DocumentType.IBAN_LETTER,
            })
          }
          navigation
        />
        <DocumentCard
          title={t("Documents.RequestDocumentScreen.bankCertificate")}
          description={t("Documents.RequestDocumentScreen.bankCertificateDesc")}
          icon={<CardMembershipIcon />}
          onSelect={() =>
            navigation.navigate("Documents.RequestDocumentTypeScreen", {
              documentType: DocumentType.BANK_CERTIFICATE,
            })
          }
          navigation
        />
        <DocumentCard
          title={t("Documents.RequestDocumentScreen.taxInvoice")}
          description={t("Documents.RequestDocumentScreen.taxInvoiceDesc")}
          icon={<TaxInvoiceIcon />}
          onSelect={() =>
            navigation.navigate("Documents.RequestDocumentTypeScreen", {
              documentType: DocumentType.CONSOLIDATED_TAX_INVOICE,
            })
          }
          navigation
        />
      </Stack>
    </Stack>
  );
}
