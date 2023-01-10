import { cloneElement } from "react";
import { Pressable, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import InputLabel from "./InputLabel";

interface InputBoxProps {
  buttonIcon?: React.ReactElement;
  isEditable?: boolean;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  onPress?: () => void;
  value?: string | undefined;
}

export default function InputBox({
  buttonIcon,
  isEditable = true,
  label,
  placeholder,
  isRequired = true,
  onPress,
  value,
}: InputBoxProps) {
  const containerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      backgroundColor: theme.palette["neutralBase-50"],
      borderColor: theme.palette["neutralBase-20"],
      borderRadius: theme.radii.extraSmall,
      borderWidth: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.medium,
    }),
    []
  );

  const optionalLabelStyle = useThemeStyles<ViewStyle>(theme => ({
    marginLeft: theme.spacing.medium,
    marginTop: theme.spacing.small / 2,
  }));

  const buttonIconColor = useThemeStyles(t => t.palette.neutralBase);

  return (
    <Pressable disabled={!isEditable} onPress={onPress}>
      {undefined !== label && <InputLabel>{label}</InputLabel>}
      <View style={[containerStyle, { minHeight: 53 }]}>
        <Typography.Text color={undefined !== value ? "neutralBase+30" : "neutralBase"} size="callout" weight="regular">
          {value ?? placeholder}
        </Typography.Text>
        {undefined !== buttonIcon && cloneElement(buttonIcon, { color: buttonIconColor })}
      </View>
      {!isRequired && (
        <View style={optionalLabelStyle}>
          <Typography.Text color="neutralBase" size="caption1" weight="regular">
            Optional
          </Typography.Text>
        </View>
      )}
    </Pressable>
  );
}
