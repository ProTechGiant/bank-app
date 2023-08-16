import { useThemeStyles } from "@/theme";

import Typography from "../Typography";

interface BoldTitleProps {
  children: string;
}

export default function BoldTitle({ children }: BoldTitleProps) {
  const style = useThemeStyles(theme => ({
    paddingVertical: theme.spacing["12p"],
  }));

  return (
    <Typography.Text weight="medium" size="title1" style={style}>
      {children}
    </Typography.Text>
  );
}
