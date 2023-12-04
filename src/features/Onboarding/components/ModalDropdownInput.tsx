import React from "react";
import { Pressable } from "react-native";

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
}

export default function ModalDropdownInput({
  options,
  modalHeader,
  type,
  onPress,
  header,
  inputLabel,
}: ModalDropdownInputProps) {
  return (
    <Stack direction="vertical" align="stretch" gap="8p">
      <Typography.Text weight="medium">{header}</Typography.Text>
      <Stack as={Pressable} align="stretch" direction="vertical" onPress={() => onPress(modalHeader, options, type)}>
        <DropdownInput pointerEvents="none" label={inputLabel} options={[]} buttonLabel="" value={undefined} />
      </Stack>
    </Stack>
  );
}
