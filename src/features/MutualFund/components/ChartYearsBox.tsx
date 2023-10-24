import { ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

interface ChartHorizontalLinesProps {
  count: number;
}

export default function ChartYearsBox({ count }: ChartHorizontalLinesProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
    alignSelf: "stretch",
    paddingHorizontal: theme.spacing["16p"],
  }));
  // TODO: add arabic translation
  const renderLines = () => {
    const lines = [];
    for (let i = 0; i < count; i++) {
      lines.push(
        <Typography.Text key={i} size="caption1" color="neutralBase-10">
          {`${i + 1} Y`}
        </Typography.Text>
      );
    }
    return lines;
  };

  return (
    <Stack direction="horizontal" align="center" justify="space-around" style={containerStyle}>
      {renderLines()}
    </Stack>
  );
}
