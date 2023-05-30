import { format } from "date-fns";
import React from "react";
import { useTranslation } from "react-i18next";
import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import FormatTransactionAmount from "@/components/FormatTransactionAmount";
import { TableListCard, TableListCardGroup } from "@/components/TableList";
import Typography from "@/components/Typography";

interface Transaction {
  id: number;
  icon: React.ReactElement<SvgProps | IconProps>;
  amount: number;
  title: string;
  date: string;
  separator?: boolean;
  CreditDebitIndicator: string;
}

interface TransactionCardListProps {
  transactions: Transaction[];
}

export default function TransactionCardList({ transactions }: TransactionCardListProps) {
  const { t } = useTranslation();

  return (
    <>
      {transactions.length > 0 ? (
        <TableListCardGroup>
          {transactions.map(element => (
            <TableListCard
              key={element.id}
              label={element.title}
              helperText={format(new Date(element.date), "dd MMM yyyy")}
              icon={element.icon}
              end={
                <TableListCard.Label bold>
                  <Typography.Text
                    color={element.CreditDebitIndicator !== "Debit" ? "successBase" : "neutralBase+30"}
                    size="callout"
                    weight="semiBold">
                    <FormatTransactionAmount
                      amount={element.amount}
                      isPlusSignIncluded={element.CreditDebitIndicator !== "Debit"}
                      color={element.CreditDebitIndicator !== "Debit" ? "successBase" : "neutralBase+30"}
                      integerSize="callout"
                      decimalSize="footnote"
                      isCurrencyIncluded={false}
                    />
                  </Typography.Text>
                </TableListCard.Label>
              }
            />
          ))}
        </TableListCardGroup>
      ) : (
        <Typography.Text color="neutralBase" size="footnote" weight="regular">
          {t("SavingsGoals.GoalDetailsScreen.Transactions.showPayments")}
        </Typography.Text>
      )}
    </>
  );
}
