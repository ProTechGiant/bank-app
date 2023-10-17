import React from "react";
import { ViewStyle } from "react-native";

import { CalendarAltIcon } from "@/assets/icons";
import { Stack } from "@/components";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface ConnectionDateProps {
  connectionText: string;
  date: string;
}

export default function ConnectionCard({ connectionText, date }: ConnectionDateProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["24p"],
    marginVertical: theme.spacing["12p"],
  }));

  const iconSpacingStyle = useThemeStyles<ViewStyle>(theme => ({
    marginStart: theme.spacing["16p"],
  }));

  const iconColor = useThemeStyles<string>(theme => theme.palette.complimentBase);

  return (
    <Stack direction="horizontal" justify="space-between" style={containerStyle}>
      <Stack direction="horizontal" align="center">
        <CalendarAltIcon color={iconColor} />
        <Typography.Text size="callout" weight="medium" color="neutralBase+30" style={iconSpacingStyle}>
          {connectionText}
        </Typography.Text>
      </Stack>
      <Typography.Text size="callout" weight="medium" color="neutralBase+30">
        {date}
      </Typography.Text>
    </Stack>
  );
}
