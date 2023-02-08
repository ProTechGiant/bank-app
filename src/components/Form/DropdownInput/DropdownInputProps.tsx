import { Control, FieldValues, Path, PathValue } from "react-hook-form";

import InputBox from "../internal/InputBox";

export default interface DropdownInputProps<T extends FieldValues> {
  control: Control<T>;
  fullHeight?: boolean;
  extra?: React.ComponentProps<typeof InputBox>["extraStart"];
  isEditable?: boolean;
  headerText?: string;
  placeholder?: string;
  name: Path<T>;
  label?: string;
  options: Array<{ label: string; value: PathValue<T, Path<T>>; disabled?: boolean }>;
  buttonLabel: string;
  autoselect: boolean;
}
