import { View, ViewStyle } from "react-native";

import { CheckCircle, SyncIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface CheckAccountSetupPointProps {
  text: string;
  completed: boolean;
}

const CheckAccountSetupPoint = ({ text, completed }: CheckAccountSetupPointProps) => {
  const checkStatusContainer: ViewStyle = {
    flexDirection: "row",
  };

  const checkStatusIcon = useThemeStyles<ViewStyle>(theme => ({
    paddingRight: theme.spacing["8p"],
  }));

  return (
    <View style={checkStatusContainer}>
      <View style={checkStatusIcon}>{completed ? <CheckCircle /> : <SyncIcon />}</View>
      <Typography.Text size="caption1">{text}</Typography.Text>
    </View>
  );
};

export default CheckAccountSetupPoint;
