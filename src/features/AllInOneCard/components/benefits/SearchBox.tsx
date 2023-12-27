import { Pressable, TextInput, TextStyle, View, ViewStyle } from "react-native";

import { OutlinedCancelIcon, SearchIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import { useTheme, useThemeStyles } from "@/theme";

interface SearchInputProps {
  isEditable?: boolean;
  onClear?: () => void;
  onSearch: (searchQuery: string) => void;
  placeholder: string;
  value: string;
  onFocus?: () => void;
  onBlur?: () => void;
  testID?: string;
}

export default function SearchInput({
  isEditable = true,
  value,
  placeholder,
  onClear,
  onSearch,
  testID,
}: SearchInputProps) {
  const { theme } = useTheme();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing["12p"],
    backgroundColor: theme.palette.neutralBaseHover,
    paddingVertical: 2,
    paddingLeft: theme.spacing["8p"],
    borderRadius: theme.radii.regular,
    marginTop: theme.spacing["16p"],
  }));

  const textInputStyle = useThemeStyles<ViewStyle & TextStyle>(
    theme => ({
      color: isEditable ? theme.palette["neutralBase-60"] : theme.palette["neutralBase-20"],
      fontSize: theme.typography.text.sizes.callout,
      fontWeight: theme.typography.text.weights.regular,
      flexGrow: 1,
      margin: 0,
      paddingRight: theme.spacing["4p"],
      maxWidth: "93%",
    }),
    [isEditable]
  );
  const iconStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    justifyContent: "center",
    paddingStart: theme.spacing["12p"],
    paddingEnd: theme.spacing["12p"],
  }));

  return (
    <View style={containerStyle}>
      <Stack direction="horizontal" align="center" gap="8p">
        <View>
          <SearchIcon height={24} width={24} color={theme.palette["neutralBase-10"]} />
        </View>
        <TextInput
          onChangeText={onSearch}
          placeholder={placeholder}
          placeholderTextColor={theme.palette["neutralBase+10"]}
          style={textInputStyle}
          testID={testID}
          value={value}
        />
        {value !== "" ? (
          <Pressable
            style={iconStyle}
            onPress={() => {
              onClear && onClear();
            }}>
            <OutlinedCancelIcon color={theme.palette["neutralBase-10"]} />
          </Pressable>
        ) : null}
      </Stack>
    </View>
  );
}
