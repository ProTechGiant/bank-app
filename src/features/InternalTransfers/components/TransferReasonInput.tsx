import { Picker } from "@react-native-picker/picker";
import { useMemo, useRef, useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Platform, Pressable, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import { AngleDownIcon } from "@/assets/icons";
import DropdownIOS from "@/components/DropdownIOS";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { TransferReason } from "../types";

interface TransferReasonInputProps<T extends FieldValues> {
  isLoading: boolean;
  reasons: TransferReason[];
  control: Control<T>;
  name: Path<T>;
}

export default function TransferReasonInput<T extends FieldValues>({
  isLoading,
  reasons,
  control,
  name,
}: TransferReasonInputProps<T>) {
  const { t } = useTranslation();

  const { field } = useController({ control, name });
  const pickerRef = useRef<Picker<never>>(null);
  const [isVisible, setIsVisible] = useState(false);

  const buttonStyle = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "flex-start",
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.radii.medium,
    flexDirection: "row",
    justifyContent: "center",
    minWidth: "35%",
    alignItems: "center",
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["8p"],
  }));

  const pickerAndroidPromptStyle = useThemeStyles<TextStyle>(theme => ({
    fontSize: theme.typography.text.sizes.body,
  }));

  const pickerAndroidItemStyle = useThemeStyles<TextStyle>(theme => ({
    fontSize: theme.typography.text.sizes.callout,
  }));

  const iconColor = useThemeStyles(theme => theme.palette.neutralBase);
  const options = useMemo(
    () =>
      reasons.map(element => ({
        value: element.Code,
        label: element.Description,
      })),
    [reasons]
  );

  return Platform.OS === "ios" ? (
    <>
      <Stack as={Pressable} direction="horizontal" gap="12p" style={buttonStyle} onPress={() => setIsVisible(true)}>
        {isLoading ? (
          <ActivityIndicator size="small" />
        ) : (
          <>
            <Typography.Text color="neutralBase+30" weight="regular" size="callout">
              {field.value === undefined
                ? reasons[0]?.Description
                : reasons.find(element => element.Code === field.value)?.Description}
            </Typography.Text>
            <AngleDownIcon color={iconColor} />
          </>
        )}
      </Stack>
      <DropdownIOS
        autoselect
        buttonLabel={t("InternalTransfers.TransferReasonInput.confirm")}
        onClose={() => {
          setIsVisible(false);
        }}
        onChange={value => {
          field.onChange(value);
          field.onBlur();
        }}
        options={options}
        headerText={t("InternalTransfers.TransferReasonInput.reason")}
        isVisible={isVisible}
        value={field.value}
      />
    </>
  ) : (
    <View>
      <Picker
        ref={pickerRef}
        onValueChange={value => {
          if (!isVisible) return;

          field.onChange(value);
          field.onBlur();

          setIsVisible(false);
        }}
        selectedValue={field.value}
        style={styles.picker}>
        <Picker.Item
          enabled={false}
          label={t("InternalTransfers.TransferReasonInput.reason")}
          style={pickerAndroidPromptStyle}
        />
        {options.map(option => (
          <Picker.Item key={option.value} label={option.label} value={option.value} style={pickerAndroidItemStyle} />
        ))}
      </Picker>
      <Stack
        as={Pressable}
        direction="horizontal"
        gap="12p"
        style={buttonStyle}
        onPress={() => {
          setIsVisible(true);
          pickerRef.current?.focus();
        }}>
        {isLoading ? (
          <ActivityIndicator size="small" />
        ) : (
          <>
            <Typography.Text color="neutralBase+30" weight="regular" size="callout">
              {field.value === undefined
                ? reasons[0]?.Description
                : reasons.find(element => element.Code === field.value)?.Description}
            </Typography.Text>
            <AngleDownIcon color={iconColor} />
          </>
        )}
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  picker: {
    opacity: 0,
    position: "absolute",
  },
});
