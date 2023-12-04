import { useThemeStyles } from "@/theme";
import * as theme from "@/theme/values";

import Typography from "../Typography";

interface BoldTitleProps {
  children: string;
  color?: keyof typeof theme.palette;
}

export default function BoldTitle({ children, color = "neutralBase+30" }: BoldTitleProps) {
  const style = useThemeStyles(theme => ({
    paddingVertical: theme.spacing["12p"],
  }));

  return (
    <Typography.Text weight="medium" size="title1" style={style} color={color}>
      {children}
    </Typography.Text>
  );
}
