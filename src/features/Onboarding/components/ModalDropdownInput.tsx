import React, { useMemo } from "react";
import { Platform, Pressable } from "react-native";

import { Stack, Typography } from "@/components";
import { DropdownInput } from "@/components/Input";

import { ListItemType } from "../types";

interface ModalDropdownInputProps {
  onPress: (header: string, listItems: ListItemType[], type: string) => void;
  options: ListItemType[];
  type: string;
  modalHeader: string;
  inputLabel: string;
  header: string;
  testID?: string;
}

export default function ModalDropdownInput({
  options,
  modalHeader,
  type,
  onPress,
  header,
  inputLabel,
  testID,
}: ModalDropdownInputProps) {
  const label = useMemo(() => {
    if (Platform.OS === "ios") {
      return { placeholder: inputLabel };
    } else {
      return { label: inputLabel };
    }
  }, [inputLabel]);

  return (
    <Stack direction="vertical" align="stretch" gap="8p">
      <Typography.Text weight="medium">{header}</Typography.Text>
      <Stack as={Pressable} align="stretch" direction="vertical" onPress={() => onPress(modalHeader, options, type)}>
        <DropdownInput testID={testID} pointerEvents="none" {...label} options={[]} buttonLabel="" value={undefined} />
      </Stack>
    </Stack>
  );
}
