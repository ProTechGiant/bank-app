import { Control, FieldValues, Path } from "react-hook-form";

import { DropdownInputProps as DIDropdownInputProps } from "@/components/DropdownInput";

interface DropdownInputProps<T extends FieldValues>
  extends Omit<DIDropdownInputProps<any>, "onChange" | "onClose" | "isVisible" | "value"> {
  extra?: string;
  control: Control<T>;
  isEditable?: boolean;
  label?: string;
  placeholder?: string;
  name: Path<T>;
}

export default DropdownInputProps;
