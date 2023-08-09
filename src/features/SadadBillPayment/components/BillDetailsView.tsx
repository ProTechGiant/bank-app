import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { I18nManager, ImageStyle, Pressable, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { EditIcon } from "@/assets/icons";
import NetworkImage from "@/components/NetworkImage";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface BillDetailsViewProp {
  billDescription: string;
  serviceType: string;
  billAmount: number | string;
  dueDate?: string;
  billingAccount: string;
  billerID: string;
  billAmountCurrency: string;
  referenceNumber?: string;
  paidAmount: number | string;
  paymentDate: string;
  billerLogoUrl: string;
  onEditBillDescription?: () => void; //setting this optional because this component is being used at other screens too
}

export default function BillDetailsView({
  billDescription,
  serviceType,
  billAmount,
  dueDate,
  billingAccount,
  billerID,
  billAmountCurrency,
  referenceNumber,
  paidAmount,
  paymentDate,
  billerLogoUrl,
  onEditBillDescription,
}: BillDetailsViewProp) {
  const { t } = useTranslation();

  const editIconColor = useThemeStyles<string>(theme => theme.palette["primaryBase-40"]);

  const imageStyle = useThemeStyles<ImageStyle>(theme => ({
    borderRadius: theme.radii.small,
    height: theme.spacing["64p"],
    width: theme.spacing["64p"],
  }));

  return (
    <ScrollView style={styles.container}>
      <Stack direction="vertical" gap="20p" align="stretch">
        <Stack direction="horizontal" align="center" justify="space-between">
          <View>
            <Typography.Text color="neutralBase" weight="medium" size="callout">
              {t("SadadBillPayments.BillDetailsScreen.billDescription")}
            </Typography.Text>
            <Typography.Text weight="regular" size="title1">
              {billDescription}
            </Typography.Text>
          </View>
          {onEditBillDescription !== undefined ? (
            <Pressable style={styles.editIconContainer} onPress={onEditBillDescription}>
              <EditIcon color={editIconColor} />
            </Pressable>
          ) : null}
        </Stack>
        <Stack direction="horizontal" align="center" justify="space-between">
          <View>
            <Typography.Text color="neutralBase" weight="medium" size="callout">
              {t("SadadBillPayments.BillDetailsScreen.billProvider")}
            </Typography.Text>
            <Typography.Text weight="regular" size="body">
              {serviceType}
            </Typography.Text>
          </View>
          <View>
            <NetworkImage style={imageStyle} source={{ uri: billerLogoUrl || "" }} />
          </View>
        </Stack>
        {paidAmount !== undefined ? (
          <View>
            <Typography.Text color="neutralBase" weight="medium" size="callout">
              {t("SadadBillPayments.BillDetailsScreen.amountPaid")}
            </Typography.Text>
            <Typography.Text weight="regular" size="title2">
              {paidAmount}
              <Typography.Text size="footnote"> {billAmountCurrency}</Typography.Text>
            </Typography.Text>
          </View>
        ) : null}
        <View>
          <Typography.Text color="neutralBase" weight="medium" size="callout">
            {t("SadadBillPayments.BillDetailsScreen.billAmount")}
          </Typography.Text>
          <Typography.Text weight="regular" size="title2">
            {billAmount}
            <Typography.Text size="footnote"> {billAmountCurrency}</Typography.Text>
          </Typography.Text>
        </View>
        <View>
          <Typography.Text color="neutralBase" weight="medium" size="callout">
            {t("SadadBillPayments.BillDetailsScreen.currentDueDate")}
          </Typography.Text>

          {paymentDate ? (
            <Typography.Text weight="regular" size="body">
              {format(new Date(paymentDate), "dd MMM yyyy") +
                " " +
                t("SadadBillPayments.BillDetailsScreen.atText") +
                " " +
                format(new Date(paymentDate), "H:MM")}
            </Typography.Text>
          ) : null}

          {dueDate ? (
            <Typography.Text weight="regular" size="body">
              {format(new Date(dueDate), "dd MMM YYY")}
            </Typography.Text>
          ) : null}
        </View>
        <View>
          <Typography.Text color="neutralBase" weight="medium" size="callout">
            {t("SadadBillPayments.BillDetailsScreen.accountNumber")}
          </Typography.Text>
          <Typography.Text weight="regular" size="body">
            {billingAccount}
          </Typography.Text>
        </View>
        <View>
          <Typography.Text color="neutralBase" weight="medium" size="callout">
            {t("SadadBillPayments.BillDetailsScreen.billerNumber")}
          </Typography.Text>
          <Typography.Text weight="regular" size="body">
            {billerID}
          </Typography.Text>
        </View>
        {referenceNumber !== undefined ? (
          <View>
            <Typography.Text color="neutralBase" weight="medium" size="callout">
              {t("SadadBillPayments.BillDetailsScreen.referenceNumber")}
            </Typography.Text>
            <Typography.Text weight="regular" size="body">
              {referenceNumber}
            </Typography.Text>
          </View>
        ) : null}
      </Stack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  editIconContainer: {
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
});
