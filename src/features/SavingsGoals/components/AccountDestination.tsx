import { TableListCard } from "@/components/TableList";

interface AccountDestinationProps {
  balance: number;
  accountName: string;
  destination: string;
}

export default function AccountDestination({ balance, accountName, destination }: AccountDestinationProps) {
  return (
    <TableListCard
      label={destination}
      helperText={accountName}
      end={<TableListCard.Label>{balance.toLocaleString("en-US", { style: "decimal" }) + " SAR"}</TableListCard.Label>}
    />
  );
}
