import times from "lodash/times";
import { View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

function PlaceholderQuickActionItem() {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    borderColor: theme.palette["neutralBase+10"],
    borderStyle: "dashed",
    borderWidth: 1,
    marginHorizontal: theme.spacing["20p"],
    marginBottom: theme.spacing["12p"],
    paddingHorizontal: theme.spacing["48p"],
    paddingVertical: theme.spacing["8p"],
  }));

  return (
    <View style={containerStyle}>
      <Typography.Text color="neutralBase-10" size="callout" weight="medium">
        Select an action from the list below to proceed
      </Typography.Text>
    </View>
  );
}

export default function PlaceholderGenerator({ amount }: { amount: number }) {
  return (
    <>
      {times(amount).map(index => (
        <PlaceholderQuickActionItem key={index} />
      ))}
    </>
  );
}
