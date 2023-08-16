import { format, parseISO } from "date-fns";
import React from "react";
import { useTranslation } from "react-i18next";

import FormatTransactionAmount from "@/components/FormatTransactionAmount";
import List from "@/components/List";
import Typography from "@/components/Typography";

interface Transaction {
  id: number;
  amount: number;
  title: string;
  date: string;
  creditDebitIndicator: string;
}

interface TransactionCardListProps {
  transactions: Transaction[];
}

export default function TransactionCardList({ transactions }: TransactionCardListProps) {
  const { t } = useTranslation();

  return transactions.length > 0 ? (
    <List>
      {transactions.map(element => (
        <List.Item.TableCell
          key={element.id}
          label={element.title}
          helperText={format(parseISO(element.date), "dd MMM yyyy")}
          end={
            <List.End.Label bold>
              <Typography.Text
                color={element.creditDebitIndicator !== "Debit" ? "successBase" : "neutralBase+30"}
                size="callout"
                weight="regular">
                <FormatTransactionAmount
                  amount={element.amount}
                  isPlusSignIncluded={element.creditDebitIndicator !== "Debit"}
                  color={element.creditDebitIndicator !== "Debit" ? "successBase" : "neutralBase+30"}
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
