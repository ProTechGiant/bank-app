import List from "@/components/List";

interface AccountDestinationProps {
  balance: number;
  accountName: string;
  destination: string;
}

export default function AccountDestination({ balance, accountName, destination }: AccountDestinationProps) {
  return (
    <List isBordered>
      <List.Item.Primary
        label={destination}
        helperText={accountName}
        end={<List.End.Label>{balance.toLocaleString("en-US", { style: "decimal" }) + " SAR"}</List.End.Label>}
      />
    </List>
  );
}
