import { View, ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

interface ChartHorizontalLinesProps {
  count: number;
}

export default function ChartHorizontalLines({ count }: ChartHorizontalLinesProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: 280,
    height: 127,
    borderWidth: 2,
    borderColor: theme.palette["neutralBase-50"],
    position: "absolute",
    justifyContent: "space-between",
  }));

  const lineStyle = useThemeStyles<ViewStyle>(theme => ({
    height: 1,
    backgroundColor: theme.palette["neutralBase-20"],
  }));

  const renderLines = () => {
    const lines = [];
    for (let i = 0; i < count; i++) {
      lines.push(<View key={i} style={lineStyle} />);
    }
    return lines;
  };

  return <View style={containerStyle}>{renderLines()}</View>;
}
