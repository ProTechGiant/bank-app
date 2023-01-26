import { ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface InputLabelProps {
  children: string;
}

export default function InputLabel({ children }: InputLabelProps) {
  const labelStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignSelf: "flex-start",
      marginBottom: theme.spacing.small / 2,
    }),
    []
  );

  return (
    <Typography.Text size="callout" weight="medium" color="neutralBase+30" style={labelStyle}>
      {children}
    </Typography.Text>
  );
}
