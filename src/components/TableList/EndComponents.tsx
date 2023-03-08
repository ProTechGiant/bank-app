import { Control, FieldValues, Path, useController } from "react-hook-form";
import { I18nManager, Pressable, View } from "react-native";

import { ChevronRightIcon, CopyIcon } from "@/assets/icons";
import DatePickerInput from "@/components/Form/DatePickerInput";
import Toggle from "@/components/Toggle";
import Typography from "@/components/Typography";

import { useInfoStyles } from "./Styles";

interface CopyProps {
  onCopyPress: () => void;
}

interface DateProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  headerText: string;
  buttonText: string;
  placeHolder: string;
}

interface LabelProps {
  label: string;
}

interface ToggleProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  disabled?: boolean;
}

const Chevron = () => {
  const { chevronColor, chevronHeight, chevronWidth } = useInfoStyles();

  return (
    <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
      <ChevronRightIcon width={chevronWidth} height={chevronHeight} color={chevronColor} />
    </View>
  );
};

const Copy = ({ onCopyPress }: CopyProps) => {
  const { copyColor, copyHeight, copyWidth } = useInfoStyles();

  return (
    <Pressable onPress={onCopyPress}>
      <CopyIcon width={copyWidth} height={copyHeight} color={copyColor} />
    </Pressable>
  );
};

const Label = ({ label }: LabelProps) => {
  return (
    <View>
      <Typography.Text color="neutralBase" size="callout">
        {label}
      </Typography.Text>
    </View>
  );
};

const TableListDate = <T extends FieldValues>({ control, headerText, buttonText, placeHolder, name }: DateProps<T>) => {
  const { field } = useController({ control, name });
  const { dateContainer } = useInfoStyles();

  return (
    <View style={dateContainer}>
      <DatePickerInput
        control={control}
        placeholder={placeHolder}
        name={field.name}
        headerText={headerText}
        buttonText={buttonText}
        minimumDate={new Date()}
      />
    </View>
  );
};

const TableListToggle = <T extends FieldValues>({ control, name, disabled = false }: ToggleProps<T>) => {
  const { field } = useController({ control, name });

  return <Toggle disabled={disabled} onPress={() => field.onChange(!field.value)} value={field.value} />;
};

export { Chevron, Copy, Label, TableListDate, TableListToggle };
