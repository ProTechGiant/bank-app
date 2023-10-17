import { ReactNode } from "react";
import { View, ViewStyle } from "react-native";

import { Typography } from "@/components";
import { useThemeStyles } from "@/theme";

interface BoxContainerProps {
  title: string;
  children: ReactNode;
}

export default function BoxContainer({ title, children }: BoxContainerProps) {
  const boxViewStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 1,
    borderRadius: theme.spacing["8p"],
    borderColor: theme.palette["neutralBase-30"],
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["20p"],
    gap: theme.spacing["16p"],
  }));

  const verticalGapContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["8p"],
  }));

  return (
    <View style={verticalGapContainerStyle}>
      <Typography.Text size="title3" color="neutralBase+30" weight="bold">
        {title}
      </Typography.Text>
      <View style={boxViewStyle}>{children}</View>
    </View>
  );
}
