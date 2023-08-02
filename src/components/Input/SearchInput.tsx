import { forwardRef, useState } from "react";
import { Pressable, TextInput, TextStyle, View, ViewStyle } from "react-native";

import { SearchIcon } from "@/assets/icons";
import { CloseCircleFilledIcon } from "@/assets/icons/CloseCircleFilledIcon";
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
}

function SearchInput_(
  { isEditable = true, value, placeholder, onClear, onSearch, onFocus, onBlur }: SearchInputProps,
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

  return (
    <View style={containerStyle}>
      <InputBox addonStart={<SearchIcon height={24} width={24} />} isFocused={isFocused}>
        <Stack direction="horizontal" align="center" flex={1}>
          <TextInput
            ref={ref}
            onBlur={handleOnBlur}
            onFocus={handleOnFocus}
            onChangeText={onSearch}
            placeholder={placeholder}
            style={textInputStyle}
            value={value}
          />
          {/* removed clear text and added cross icon as according to new design. */}
          {value.length > 0 ? (
            <Pressable onPress={onClear}>
              <CloseCircleFilledIcon />
            </Pressable>
          ) : null}
        </Stack>
      </InputBox>
    </View>
  );
}

export const SearchInput = forwardRef(SearchInput_);
