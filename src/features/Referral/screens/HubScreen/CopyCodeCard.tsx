import { cloneElement } from "react";
import { TouchableOpacity, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import Typography from "@/components/Typography";
import { Theme, useThemeStyles } from "@/theme";

export interface CopyCodeCardProps {
  backgroundColor?: keyof Theme["palette"];
  leftText: string;
  rightIcon?: React.ReactElement<SvgProps>;
  onPress: () => void;
}
export default function CopyCodeCard({ backgroundColor, leftText, rightIcon: Icon, onPress }: CopyCodeCardProps) {
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      borderWidth: 1,
      borderColor: theme.palette["tintBase-30"],
      minHeight: 54,
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
      paddingHorizontal: theme.spacing["16p"],
      borderRadius: theme.radii.extraSmall,
      backgroundColor: backgroundColor ? theme.palette[backgroundColor] : "",
    }),
    []
  );

  const iconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.shareCopy, []);

  return (
    <TouchableOpacity style={container} onPress={onPress}>
      <Typography.Text>{leftText}</Typography.Text>
      {Icon !== undefined && cloneElement(Icon, { height: iconDimensions, width: iconDimensions })}
    </TouchableOpacity>
  );
}
