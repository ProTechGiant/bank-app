import { Pressable, View } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import Typography from "@/components/Typography";

import { styles, useInfoStyles } from "./Styles";
import { TableListCardProps } from "./TableListCard";

export default function TableListCardBody({ helperText, label, onInfoPress, onPress }: TableListCardProps) {
  const { infoIconStyle, infoColor, infoDimensions } = useInfoStyles();
  return (
    <Pressable onPress={onPress} disabled={typeof onPress === "function" ? false : true} style={styles.bodyContainer}>
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
      {helperText ? (
        <Typography.Text color="neutralBase" size="footnote">
          {helperText}
        </Typography.Text>
      ) : null}
    </Pressable>
  );
}
