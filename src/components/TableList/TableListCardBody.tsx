import { Pressable, View, ViewStyle } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { styles, useInfoStyles } from "./Styles";

interface TableListCardBodyProps {
  isError?: boolean;
  helperText?: string;
  label: string;
  onInfoPress?: () => void;
}

export default function TableListCardBody({ isError, helperText, label, onInfoPress }: TableListCardBodyProps) {
  const { infoIconStyle, infoColor, infoDimensions } = useInfoStyles();

  const helperTextStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["4p"],
  }));

  return (
    <View style={styles.bodyContainer}>
      <View style={styles.label}>
        <Typography.Text color="neutralBase+30" size="callout" weight="medium">
          {label}
        </Typography.Text>
        {undefined !== onInfoPress && (
          <Pressable onPress={onInfoPress} style={infoIconStyle}>
            <InfoCircleIcon color={infoColor} width={infoDimensions} height={infoDimensions} />
          </Pressable>
        )}
      </View>
      {undefined !== helperText ? (
        <View style={helperTextStyle}>
          <Typography.Text color={isError ? "errorBase" : "neutralBase"} size="footnote">
            {helperText}
          </Typography.Text>
        </View>
      ) : null}
    </View>
  );
}
