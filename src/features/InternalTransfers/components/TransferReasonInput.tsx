import { Picker } from "@react-native-picker/picker";
import { useMemo, useRef, useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Platform, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { AngleDownIcon } from "@/assets/icons";
import DropdownInput from "@/components/DropdownInput";
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
  // below variable is required as a guard against this bug: https://github.com/react-native-picker/picker/issues/116
  const isOpenedAtLeastOnce_Android = useRef(false);
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
                ? t("InternalTransfers.TransferReasonInput.reason")
                : reasons.find(element => element.Code === field.value)?.Description}
            </Typography.Text>
            <AngleDownIcon color={iconColor} />
          </>
        )}
      </Stack>
      <DropdownInput
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
          if (isOpenedAtLeastOnce_Android.current === false) {
            return;
          }

          field.onChange(value);
          field.onBlur();
        }}
        selectedValue={field.value}
        prompt={t("InternalTransfers.TransferReasonInput.reason")}
        style={styles.picker}>
        {options.map(option => (
          <Picker.Item key={option.value} label={option.label} value={option.value} />
        ))}
      </Picker>
      <Stack
        as={Pressable}
        direction="horizontal"
        gap="12p"
        style={buttonStyle}
        onPress={() => {
          isOpenedAtLeastOnce_Android.current = true;
          pickerRef.current?.focus();
        }}>
        {isLoading ? (
          <ActivityIndicator size="small" />
        ) : (
          <>
            <Typography.Text color="neutralBase+30" weight="regular" size="callout">
              {field.value === undefined
                ? t("InternalTransfers.TransferReasonInput.reason")
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
