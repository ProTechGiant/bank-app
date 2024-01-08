import { forwardRef, useState } from "react";
import { TextInput, TextStyle, View, ViewStyle } from "react-native";

import { SearchIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import { useThemeStyles } from "@/theme";

import InputBox from "./internal/InputBox";

interface SearchInputProps {
  isEditable?: boolean;
  onClear?: () => void;
  onSearch: (searchQuery: string) => void;
  placeholder: string;
  value: string;
  onFocus?: () => void;
  onBlur?: () => void;
  testID?: string;
  maxLength?: number;
  changePlaceHolderColor?: boolean;
}

function SearchInput_(
  {
    isEditable = true,
    value,
    placeholder,
    onClear,
    onSearch,
    onFocus,
    onBlur,
    testID,
    maxLength = 50,
    changePlaceHolderColor = false,
  }: SearchInputProps,
  ref: React.ForwardedRef<TextInput>
) {
  const [isFocused, setIsFocused] = useState(false);

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing["12p"],
  }));

  const textInputStyle = useThemeStyles<ViewStyle & TextStyle>(
    theme => ({
      color: isEditable ? theme.palette["neutralBase+30"] : theme.palette["neutralBase-20"],
      fontSize: theme.typography.text.sizes.callout,
      fontWeight: theme.typography.text.weights.regular,
      flexGrow: 1,
      margin: 0,
      paddingRight: theme.spacing["4p"],
      maxWidth: "93%",
    }),
    [isEditable]
  );

  const handleOnFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };

  const handleOnBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  const placeholderColor = useThemeStyles(theme => theme.palette["neutralBase+10"]);
  return (
    <View style={containerStyle}>
      <InputBox
        value={value}
        onClear={onClear}
        testID={testID}
        addonStart={<SearchIcon height={24} width={24} />}
        isFocused={isFocused}>
        <Stack direction="horizontal" align="center" flex={1}>
          <TextInput
            ref={ref}
            onBlur={handleOnBlur}
            onFocus={handleOnFocus}
            onChangeText={onSearch}
            placeholder={placeholder}
            style={textInputStyle}
            testID={testID}
            value={value}
            maxLength={maxLength}
            placeholderTextColor={changePlaceHolderColor ? placeholderColor : ""}
          />
          {/* removed clear text and added cross icon as according to new design. */}
        </Stack>
      </InputBox>
    </View>
  );
}

export const SearchInput = forwardRef(SearchInput_);
