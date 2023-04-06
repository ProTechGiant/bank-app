import { useState } from "react";

import { SearchIcon } from "@/assets/icons";
import Button from "@/components/Button";
import Stack from "@/components/Stack";
import StyledTextInput from "@/components/TextInput";

interface SearchInputProps {
  value: string;
  placeholder: string;
  onSearch: (searchQuery: string) => void;
  onClear: () => void;
  buttonText: string;
}

export default function SearchInput({ value, placeholder, onSearch, onClear, buttonText }: SearchInputProps) {
  const [isTouched, setIsTouched] = useState(false);

  const handleOnSearch = (searchQuery: string) => {
    onSearch(searchQuery);
  };

  return (
    <Stack direction="horizontal" align="stretch">
      <StyledTextInput
        placeholder={placeholder}
        icon={<SearchIcon />}
        value={value}
        onBlur={() => setIsTouched(true)}
        onChangeText={handleOnSearch}
        isTouched={isTouched}
      />
      {isTouched && value.length > 0 ? (
        <Button variant="tertiary" onPress={onClear}>
          {buttonText}
        </Button>
      ) : null}
    </Stack>
  );
}
