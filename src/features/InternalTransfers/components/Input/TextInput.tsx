import { TextInputProps as RNTextInputProps } from "react-native";

import SimpleTextInput from "./SimpleTextInput";

export interface TextInputProps
  extends Omit<RNTextInputProps, "onBlur" | "onFocus" | "placeholderTextColor" | "style"> {
  errorText?: string;
  extraStart?: string;
  isEditable?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
  label: string;
  onClear?: () => void;
  showCharacterCount?: boolean;
  doneButtonOnFoucs?: () => void;
  doneButtonOnBlur?: () => void;
}

interface VariantTextInputProps extends TextInputProps {
  variant?: "simple" | "small";
}

export function TextInput({ ...restProps }: VariantTextInputProps) {
  return <SimpleTextInput {...restProps} />;
}
