import React from "react";
import { View, ViewStyle } from "react-native";

import { LightningBoltIcon, RecurringEventIcon } from "@/assets/icons";
import { useThemeStyles } from "@/theme";

import TransactionCard from "./TransactionCard";

export default function TransactionCardList() {
  const cardContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
    backgroundColor: theme.palette["neutralBase-50"],
  }));

  // TODO: remove this once transaction request is implemented
  const transactions = [
    {
      id: 1,
      icon: <LightningBoltIcon />,
      amount: 50,
      title: "One-off payment",
      date: "31 Oct 2023",
      separator: true,
    },
    {
      id: 2,
      icon: <RecurringEventIcon />,
      amount: 50,
      title: "Regular payment",
      date: "19 Nov 2023",
    },
  ];

  return (
    <View style={cardContainerStyle}>
      {transactions.map(({ id, icon, amount, title, date, separator }) => {
        return <TransactionCard key={id} icon={icon} amount={amount} title={title} date={date} separator={separator} />;
      })}
    </View>
  );
}
