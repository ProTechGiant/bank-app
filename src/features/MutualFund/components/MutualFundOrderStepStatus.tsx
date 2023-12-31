import { View, ViewStyle } from "react-native";

import ErrorFailedIcon from "@/assets/icons/ErrorFailedIcon";
import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

import { DoneIcon } from "../assets/icons";

interface MutualFundOrderStepStatusProps {
  hideLine?: boolean;
  title: string;
  disabled?: boolean;
  isError?: boolean;
}

export default function MutualFundOrderStepStatus({
  hideLine,
  title,
  disabled = false,
  isError = false,
}: MutualFundOrderStepStatusProps) {
  const orderCircleBoxStyle = useThemeStyles<ViewStyle>(theme => ({
    width: theme.spacing["32p"],
    height: theme.spacing["32p"],
    backgroundColor: isError
      ? theme.palette.complimentBase
      : disabled
      ? theme.palette["neutralBase-20"]
      : theme.palette.primaryBase,
    borderRadius: theme.radii.xlarge,
    alignItems: "center",
    justifyContent: "center",
  }));

  const orderLineBoxStyle = useThemeStyles<ViewStyle>(theme => ({
    width: 2,
    backgroundColor: disabled ? theme.palette["neutralBase-20"] : theme.palette.primaryBase,
    flex: 1,
  }));

  const stepBoxStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["32p"],
    width: "80%",
  }));

  return (
    <Stack direction="horizontal" gap="16p">
      <Stack direction="vertical" align="center">
        <View style={orderCircleBoxStyle}>
          {isError ? (
            <ErrorFailedIcon color={disabled ? "#ACABBA" : "#fff"} />
          ) : (
            <DoneIcon color={disabled ? "#ACABBA" : "#fff"} />
          )}
        </View>
        {!hideLine ? <View style={orderLineBoxStyle} /> : null}
      </Stack>
      <Stack direction="vertical" gap="8p" style={stepBoxStyle}>
        <Typography.Text size="callout" weight="medium">
          {title}
        </Typography.Text>
      </Stack>
    </Stack>
  );
}
