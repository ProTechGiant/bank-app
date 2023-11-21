import { Pressable, ViewStyle } from "react-native";

import { AngleDownIcon } from "@/assets/icons";
import { Typography } from "@/components";
import { useThemeStyles } from "@/theme";

interface DropDownFieldContainerProps {
  title: string;
  value: string;
  onPress: () => void;
}
export default function DropDownFieldContainer({ title, value, onPress }: DropDownFieldContainerProps) {
  const pressableStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    backgroundColor: theme.palette["neutralBase-40"],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: theme.radii.small,
    padding: theme.spacing["16p"],
    minHeight: 60,
  }));

  return (
    <>
      <Typography.Text>{title}</Typography.Text>
      <Pressable style={pressableStyle} onPress={onPress}>
        <Typography.Text>{value}</Typography.Text>
        <AngleDownIcon />
      </Pressable>
    </>
  );
}
