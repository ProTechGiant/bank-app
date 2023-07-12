import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { Path as SvgPath, Svg } from "react-native-svg";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export interface CheckboxInputProps {
  onBlur?: () => void;
  onChange?: (value: boolean) => void;
  isEditable?: boolean;
  label?: string;
  value?: boolean;
}

export function CheckboxInput({ onBlur, onChange, isEditable = true, label, value }: CheckboxInputProps) {
  const handleOnChange = () => {
    onChange?.(!value);
    onBlur?.();
  };

  const checkBoxStyles = useThemeStyles<ViewStyle>(
    ({ palette }) => ({
      backgroundColor: !isEditable ? palette["neutralBase-40"] : value ? palette.complimentBase : undefined, //new color 'complimentBase' as per figma design
      borderColor: !isEditable ? palette["neutralBase-40"] : value ? "transparent" : palette["neutralBase-20"],
      borderRadius: 2,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      height: 18,
      width: 18,
    }),
    [value, isEditable]
  );

  return (
    <Pressable onPress={handleOnChange}>
      <Stack direction="horizontal" gap="8p">
        <View style={checkBoxStyles}>{value ? <CheckboxCheckmark /> : null}</View>
        <Typography.Text
          size="footnote"
          weight="medium"
          color={isEditable ? "neutralBase" : "neutralBase-20"}
          style={styles.text}>
          {label}
        </Typography.Text>
      </Stack>
    </Pressable>
  );
}

function CheckboxCheckmark() {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <SvgPath
        d="M18.7099 7.21001C18.617 7.11628 18.5064 7.04189 18.3845 6.99112C18.2627 6.94035 18.132 6.91422 17.9999 6.91422C17.8679 6.91422 17.7372 6.94035 17.6154 6.99112C17.4935 7.04189 17.3829 7.11628 17.29 7.21001L9.83995 14.67L6.70995 11.53C6.61343 11.4368 6.49949 11.3635 6.37463 11.3143C6.24978 11.2651 6.11645 11.2409 5.98227 11.2432C5.84809 11.2456 5.71568 11.2743 5.5926 11.3278C5.46953 11.3813 5.35819 11.4585 5.26495 11.555C5.17171 11.6515 5.0984 11.7655 5.04919 11.8903C4.99999 12.0152 4.97586 12.1485 4.97818 12.2827C4.9805 12.4169 5.00923 12.5493 5.06272 12.6724C5.11622 12.7954 5.19343 12.9068 5.28995 13L9.12995 16.84C9.22291 16.9337 9.33351 17.0081 9.45537 17.0589C9.57723 17.1097 9.70794 17.1358 9.83995 17.1358C9.97196 17.1358 10.1027 17.1097 10.2245 17.0589C10.3464 17.0081 10.457 16.9337 10.55 16.84L18.7099 8.68001C18.8115 8.58637 18.8925 8.47272 18.9479 8.34622C19.0033 8.21972 19.0319 8.08312 19.0319 7.94501C19.0319 7.80691 19.0033 7.67031 18.9479 7.54381C18.8925 7.41731 18.8115 7.30366 18.7099 7.21001Z"
        fill="#ffffff"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  text: {
    flexShrink: 1,
  },
});
