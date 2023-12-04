import { View, ViewStyle } from "react-native";

import { CheckCircleIcon, SyncIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface CheckAccountSetupPointProps {
  text: string;
  completed: boolean;
  isDark?: boolean;
}

const CheckAccountSetupPoint = ({ text, completed, isDark }: CheckAccountSetupPointProps) => {
  const checkStatusContainer: ViewStyle = {
    flexDirection: "row",
  };

  const checkStatusIcon = useThemeStyles<ViewStyle>(theme => ({
    paddingRight: theme.spacing["8p"],
  }));

  const iconColor = useThemeStyles(theme => theme.palette["warningBase-10"]);

  return (
    <View style={checkStatusContainer}>
      <View style={checkStatusIcon}>
        {completed ? <CheckCircleIcon /> : <SyncIcon color={isDark ? iconColor : "#FF7512"} />}
      </View>
      <Typography.Text size="caption1" color="neutralBase-60">
        {text}
      </Typography.Text>
    </View>
  );
};

export default CheckAccountSetupPoint;
