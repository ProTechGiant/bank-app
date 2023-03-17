import { format } from "date-fns";
import React from "react";

import { LightningBoltIcon, RecurringEventIcon } from "@/assets/icons";
import { TableListCard, TableListCardGroup } from "@/components/TableList";

export default function TransactionCardList() {
  // TODO: remove this once transaction request is implemented
  const transactions = [
    {
      id: 1,
      icon: <LightningBoltIcon />,
      amount: 50,
      title: "One-off payment",
      date: "2023-10-31 15:00:00",
      separator: true,
    },
    {
      id: 2,
      icon: <RecurringEventIcon />,
      amount: 50,
      title: "Regular payment",
      date: "2023-11-19 15:00:00",
    },
  ];

  return (
    <TableListCardGroup>
      {transactions.map(element => (
        <TableListCard
          key={element.id}
          label={element.title}
          helperText={format(new Date(element.date), "dd MMM yyyy")}
          icon={element.icon}
          end={<TableListCard.Label bold>{element.amount + " SAR"}</TableListCard.Label>}
        />
      ))}
    </TableListCardGroup>
  );
}
