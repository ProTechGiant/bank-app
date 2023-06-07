import { useState } from "react";
import { I18nManager, TextInput as RNTextInput, TextStyle, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import InputBox from "./internal/InputBox";
import InputExtra from "./internal/InputExtra";
import { TextInputProps } from "./TextInput";

export default function SmallTextInput({
  errorText,
  extraStart,
  isEditable = true,
  onBlur,
  onFocus,
  label,
  maxLength,
  numberOfLines = 1,
  showCharacterCount = false,
  value,
  ...restProps
}: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleOnFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleOnBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const textInputStyle = useThemeStyles<ViewStyle & TextStyle>(
    t => ({
      color: isEditable ? t.palette["neutralBase+30"] : t.palette["neutralBase-20"],
      fontSize: t.typography.text.sizes.callout,
      fontWeight: t.typography.text.weights.regular,
      flexGrow: 1,
      margin: 0,
      padding: 0,
    }),
    [isEditable]
  );

  return (
    <Stack align="stretch" direction="vertical" gap="8p">
      <Typography.Text color="neutralBase+30" size="callout" weight="medium">
        {label}
      </Typography.Text>
      <InputBox isError={undefined !== errorText} isFocused={isFocused} numberOfLines={numberOfLines}>
        <RNTextInput
          {...restProps}
          accessibilityLabel={label}
          editable={isEditable}
          onBlur={() => handleOnBlur()}
          onFocus={() => handleOnFocus()}
          maxLength={maxLength}
          numberOfLines={numberOfLines}
          placeholderTextColor={useThemeStyles(theme => theme.palette["neutralBase-10"])}
          style={textInputStyle}
          textAlign={I18nManager.isRTL ? "right" : "left"}
          value={value}
        />
      </InputBox>
      <InputExtra
        errorText={errorText}
        extraStart={extraStart}
        extraEnd={showCharacterCount && undefined !== maxLength ? `${value?.length ?? 0} / ${maxLength}` : undefined}
      />
    </Stack>
  );
}
