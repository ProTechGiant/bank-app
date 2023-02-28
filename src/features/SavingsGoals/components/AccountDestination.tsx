import { View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface AccountDestinationProps {
  balance: number;
  accountName: string;
  destination: string;
}

export default function AccountDestination({ balance, accountName, destination }: AccountDestinationProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    backgroundColor: theme.palette["neutralBase-50"],
    borderRadius: theme.radii.extraSmall,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: theme.spacing["16p"],
  }));

  return (
    <View style={containerStyle}>
      <View>
        <Typography.Text color="neutralBase+30" size="body" weight="medium">
          {destination}
        </Typography.Text>
        <Typography.Text color="neutralBase" size="body" weight="regular">
          {accountName}
        </Typography.Text>
      </View>
      <Typography.Text color="neutralBase" size="body" weight="regular">
        {balance.toLocaleString("en-US", { style: "decimal" }) + " SAR"}
      </Typography.Text>
    </View>
  );
}
