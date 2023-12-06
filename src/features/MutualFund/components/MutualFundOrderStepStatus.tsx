import { View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

import { DoneIcon } from "../assets/icons";

interface MutualFundOrderStepStatusProps {
  hideLine?: boolean;
  title: string;
  value: string;
}

export default function MutualFundOrderStepStatus({ hideLine, title, value }: MutualFundOrderStepStatusProps) {
  const orderCircleBoxStyle = useThemeStyles<ViewStyle>(theme => ({
    width: theme.spacing["32p"],
    height: theme.spacing["32p"],
    backgroundColor: theme.palette.primaryBase,
    borderRadius: theme.radii.xlarge,
    alignItems: "center",
    justifyContent: "center",
  }));

  const orderLineBoxStyle = useThemeStyles<ViewStyle>(theme => ({
    width: 2,
    backgroundColor: theme.palette.primaryBase,
    flex: 1,
  }));

  const stepBoxStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["32p"],
  }));

  return (
    <Stack direction="horizontal" gap="8p">
      <Stack direction="vertical" align="center">
        <View style={orderCircleBoxStyle}>
          <DoneIcon />
        </View>
        {!hideLine ? <View style={orderLineBoxStyle} /> : null}
      </Stack>
      <Stack direction="vertical" gap="8p" style={stepBoxStyle}>
        <Typography.Text size="callout" weight="medium">
          {title}
        </Typography.Text>
        <Typography.Text size="footnote" weight="regular">
          {value}
        </Typography.Text>
      </Stack>
    </Stack>
  );
}
