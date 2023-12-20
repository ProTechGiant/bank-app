import { format } from "date-fns";
import { toInteger } from "lodash";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { BakeryDiningIcon, ChevronLeftIcon, ChevronRightIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { Transaction } from "../types";

interface TransactionCellPros {
  transaction: Transaction;
  onPress: () => void;
}

export default function TransactionCell({ transaction, onPress }: TransactionCellPros) {
  const [dollars, cents] = transaction.Amount.Amount.split(".");

  const itemStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
  }));

  const { chevronColor, giftColor } = useThemeStyles(theme => ({
    chevronColor: theme.palette["neutralBase-20"],
    giftColor: theme.palette.complimentBase,
  }));

  const iconViewStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    padding: theme.spacing["16p"],
    borderRadius: theme.radii.xxlarge,
  }));

  return (
    <Pressable onPress={onPress}>
      <Stack direction="horizontal" gap="16p" align="center" justify="space-between" style={itemStyle}>
        <View style={iconViewStyle}>
          <BakeryDiningIcon color={giftColor} />
        </View>
        <Stack direction="vertical" style={styles.expandText}>
          <Typography.Text size="callout" weight="medium" color="neutralBase+30">
            {transaction?.MerchantDetails?.MerchantName}
          </Typography.Text>
          <Typography.Text size="footnote" weight="regular" color="neutralBase">
            {format(
              new Date(
                transaction.BookingDateTime[0],
                transaction.BookingDateTime[1] - 1,
                transaction.BookingDateTime[2]
              ),
              "dd MMMM yyyy"
            )}
          </Typography.Text>
        </Stack>
        <Stack direction="horizontal" align="flex-end">
          <Typography.Text
            size="callout"
            weight="bold"
            color={toInteger(dollars) > 0 ? "primaryBase-30" : "neutralBase+30"}>
            {`${dollars}`}
          </Typography.Text>
          <Typography.Text size="footnote" color={toInteger(dollars) > 0 ? "primaryBase-30" : "neutralBase+30"}>
            {`.${cents + transaction.Amount.Currency}`}
          </Typography.Text>
        </Stack>
        <Pressable style={styles.pressable}>
          {!I18nManager.isRTL ? <ChevronRightIcon color={chevronColor} /> : <ChevronLeftIcon color={chevronColor} />}
        </Pressable>
      </Stack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  expandText: {
    flex: 1,
  },
  pressable: {
    transform: [
      {
        scaleX: I18nManager.isRTL ? -1 : 1,
      },
    ],
  },
});
