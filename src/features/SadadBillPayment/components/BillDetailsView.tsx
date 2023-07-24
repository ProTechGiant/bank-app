import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { I18nManager, Image, Pressable, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { EditIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

interface BillDetailsViewProp {
  billDescription: string;
  serviceType: string;
  billAmount: number;
  dueDate: string;
  billingAccount: string;
  billerID: string;
  billAmountCurrency: string;
}

export default function BillDetailsView({
  billDescription,
  serviceType,
  billAmount,
  dueDate,
  billingAccount,
  billerID,
  billAmountCurrency,
}: BillDetailsViewProp) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const editIconColor = useThemeStyles<string>(theme => theme.palette["primaryBase-40"]);

  const handleOnEditDescriptionPress = () => {
    navigation.navigate("SadadBillPayments.EditBillDescriptionScreen");
  };

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
          <Pressable style={styles.editIconContainer} onPress={handleOnEditDescriptionPress}>
            <EditIcon color={editIconColor} />
          </Pressable>
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
            <Image source={require("../assets/images/stc-logo.png")} />
          </View>
        </Stack>
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
          <Typography.Text weight="regular" size="body">
            {format(new Date(dueDate), "dd MMM YYY")}
          </Typography.Text>
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
