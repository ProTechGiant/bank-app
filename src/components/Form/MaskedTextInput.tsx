import { FieldValues } from "react-hook-form";

import TextInput, { TextInputProps } from "./TextInput";

interface MaskedTextInputProps<T extends FieldValues> extends TextInputProps<T> {
  mask: string;
}

export default function MaskedTextInput<T extends FieldValues>({ mask, ...restProps }: MaskedTextInputProps<T>) {
  return <TextInput {...restProps} />;
}
