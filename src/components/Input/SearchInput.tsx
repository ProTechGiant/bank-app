import { forwardRef, useState } from "react";
import { Pressable, TextInput, TextStyle, View, ViewStyle } from "react-native";

import { SearchIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import InputBox from "./internal/InputBox";

interface SearchInputProps {
  clearText?: string;
  isEditable?: boolean;
  onClear?: () => void;
  onSearch: (searchQuery: string) => void;
  placeholder: string;
  value: string;
}

function SearchInput_(
  { clearText, isEditable = true, value, placeholder, onClear, onSearch }: SearchInputProps,
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
      padding: 0,
    }),
    [isEditable]
  );

  return (
    <View style={containerStyle}>
      <InputBox addonStart={<SearchIcon height={24} width={24} />} isFocused={isFocused}>
        <TextInput
          ref={ref}
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
          onChangeText={onSearch}
          placeholder={placeholder}
          style={textInputStyle}
          value={value}
        />
      </InputBox>
      {value.length > 0 ? (
        <Pressable onPress={onClear}>
          <Typography.Text color="neutralBase+30" size="callout" weight="regular">
            {clearText}
          </Typography.Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export const SearchInput = forwardRef(SearchInput_);
