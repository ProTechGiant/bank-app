import { Pressable, ViewStyle } from "react-native";

import { CloseIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface PillProps {
  children: string;
  isActive?: boolean;
  onPress: () => void;
  testID?: string;
}

export default function Pill({ children, isActive = false, onPress, testID }: PillProps) {
  const pillStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingHorizontal: theme.spacing["12p"],
      paddingVertical: theme.spacing["4p"],
      borderColor: isActive ? theme.palette["neutralBase+30"] : theme.palette["neutralBase-30"],
      borderWidth: 2,
      borderRadius: 100,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      columnGap: theme.spacing["8p"],
    }),
    [isActive]
  );

  return (
    <Pressable style={pillStyle} onPress={onPress} testID={testID}>
      <Typography.Text weight="medium" size="footnote" color="neutralBase+30">
        {children}
      </Typography.Text>
      {isActive ? <CloseIcon width={14} color="#2E2E2E" /> : null}
    </Pressable>
  );
}
