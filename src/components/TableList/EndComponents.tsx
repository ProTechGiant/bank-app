import { Control, FieldValues, Path, useController } from "react-hook-form";
import { I18nManager, Pressable, View, ViewStyle } from "react-native";

import { ChevronRightIcon, CopyIcon } from "@/assets/icons";
import DatePickerInput from "@/components/Form/DatePickerInput";
import Toggle from "@/components/Toggle";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { useInfoStyles } from "./Styles";

interface CopyProps {
  onPress: () => void;
}

interface DateProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  headerText: string;
  buttonText: string;
  placeHolder: string;
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

const Copy = ({ onPress }: CopyProps) => {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: 34,
    padding: theme.spacing["10p"],
  }));

  const copyColor = useThemeStyles(theme => theme.palette["primaryBase-40"]);

  return (
    <Pressable onPress={onPress} style={containerStyle}>
      <CopyIcon color={copyColor} height={16} width={16} />
    </Pressable>
  );
};

const Label = ({ children }: { children: React.ReactNode }) => {
  return (
    <Typography.Text color="primaryBase-40" size="callout" weight="semiBold">
      {children}
    </Typography.Text>
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
