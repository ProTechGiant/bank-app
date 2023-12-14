import { TextInputProps as RNTextInputProps } from "react-native";

import SimpleTextInput from "./SimpleTextInput";
import SmallTextInput from "./SmallTextInput";

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

export function TextInput({ variant = "simple", ...restProps }: VariantTextInputProps) {
  return variant === "small" ? <SmallTextInput {...restProps} /> : <SimpleTextInput {...restProps} />;
}
