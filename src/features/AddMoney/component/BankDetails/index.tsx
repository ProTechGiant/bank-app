import { Pressable, View, ViewStyle } from "react-native";

import { CopyIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export interface BankDetailsProps {
  label: string;
  value: string | null | undefined;
  onCopyPress: () => void;
}

export default function BankDetails({ value, label, onCopyPress }: BankDetailsProps) {
  const textStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["4p"],
    alignSelf: "center",
    flex: 0.9,
  }));

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    padding: theme.spacing["16p"],
    borderRadius: theme.radii.small,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  const buttonStyle = useThemeStyles<ViewStyle>(theme => ({
    marginRight: theme.spacing["8p"],
  }));

  const iconColor = useThemeStyles<string>(theme => theme.palette["primaryBase-40"]);

  return (
    <View style={containerStyle}>
      <View style={textStyle}>
        <Typography.Text color="neutralBase" weight="regular" size="footnote">
          {label}
        </Typography.Text>

        <Typography.Text color="neutralBase+30" weight="regular" size="callout">
          {value}
        </Typography.Text>
      </View>

      <View style={buttonStyle}>
        <Pressable onPress={onCopyPress}>
          <CopyIcon width="24" height="24" color={iconColor} />
        </Pressable>
      </View>
    </View>
  );
}
