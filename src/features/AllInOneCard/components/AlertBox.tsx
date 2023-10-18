import React from "react";
import { ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

import { InfoCircleIcon } from "../assets/icons";

interface AlertBoxProps {
  description: string;
}

export default function AlertBox({ description }: AlertBoxProps) {
  const alertStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.spacing["8p"],
    width: "100%",
  }));

  return (
    <Stack direction="horizontal" style={alertStyle} gap="16p">
      <InfoCircleIcon />
      <Typography.Text align="center" color="neutralBase+10" weight="regular" size="footnote">
        {description}
      </Typography.Text>
    </Stack>
  );
}
