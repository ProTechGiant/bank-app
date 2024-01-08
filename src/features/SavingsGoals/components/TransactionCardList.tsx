import { format } from "date-fns";
import React from "react";
import { useTranslation } from "react-i18next";

import FormatTransactionAmount from "@/components/FormatTransactionAmount";
import List from "@/components/List";
import Typography from "@/components/Typography";

import { TransactionSavingPot } from "../types";

interface TransactionCardListProps {
  transactions: TransactionSavingPot[];
}

export default function TransactionCardList({ transactions }: TransactionCardListProps) {
  const { t } = useTranslation();

  return transactions.length > 0 ? (
    <List>
      {transactions.slice(0, 2).map(element => (
        <List.Item.TableCell
          key={element.TransactionId}
          label={element.SupplementaryData.OrderingReference}
          helperText={format(
            new Date(element.BookingDateTime[0], element.BookingDateTime[1] - 1, element.BookingDateTime[2]),
            "dd MMMM yyyy"
          )}
          end={
            <List.End.Label bold>
              <Typography.Text color="successBase" size="callout" weight="regular">
                <FormatTransactionAmount
                  amount={Number(element.Amount.Amount)}
                  isPlusSignIncluded={true} // TODO: DEBIT CARD INDCATOR
                  color="successBase" // TODO: DEBIT CARD INDCATOR
                  integerSize="callout"
                  decimalSize="footnote"
                  isCurrencyIncluded={false}
                />
              </Typography.Text>
            </List.End.Label>
          }
        />
      ))}
    </List>
  ) : (
    <Typography.Text color="neutralBase" size="footnote" weight="regular">
      {t("SavingsGoals.GoalDetailsScreen.Transactions.showPayments")}
    </Typography.Text>
  );
}
