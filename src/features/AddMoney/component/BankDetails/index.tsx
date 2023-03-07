import { Pressable, View, ViewStyle } from "react-native";

import { CopyIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export interface BankDetailsProps {
  label: string;
  value: string;
  onCopyPress: () => void;
}

export default function BankDetails({ value, label, onCopyPress }: BankDetailsProps) {
  const textStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["10p"],
    paddingRight: theme.spacing["16p"],
    gap: theme.spacing["4p"],
  }));

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    paddingHorizontal: theme.spacing["20p"],
    justifyContent: "space-between",
    alignItems: "center",
  }));

  const iconColor = useThemeStyles<string>(theme => theme.palette.primaryBase);
  return (
    <View style={containerStyle}>
      <View style={textStyle}>
        <Typography.Text color="neutralBase" weight="regular" size="footnote">
          {label}
        </Typography.Text>

        {value ? (
          <Typography.Text color="neutralBase+30" weight="regular" size="callout">
            {value}
          </Typography.Text>
        ) : null}
      </View>

      <Pressable onPress={onCopyPress}>
        <CopyIcon width="24" height="24" color={iconColor} />
      </Pressable>
    </View>
  );
}
