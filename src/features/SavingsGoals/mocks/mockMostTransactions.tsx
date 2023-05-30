import { LightningBoltIcon, RecurringEventIcon } from "@/assets/icons";

export const recentTransactions = [
  {
    id: 1,
    icon: <LightningBoltIcon />,
    amount: 500,
    title: "One-off payment",
    date: "2023-05-07 15:00:00",
    separator: true,
  },
  {
    id: 2,
    icon: <RecurringEventIcon />,
    amount: 6000,
    title: "Regular payment",
    date: "2023-04-07 15:00:00",
  },
];
