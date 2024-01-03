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
  testID?: string;
  control: Control<T>;
  name: Path<T>;
}

export default function TransferReasonInput<T extends FieldValues>({
  isLoading,
  reasons,
  testID,
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
    borderRadius: theme.radii.regular,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 58,
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["8p"],
    marginTop: theme.spacing["8p"],
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
    <View style={styles.containerWidth}>
      <Stack
        as={Pressable}
        direction="horizontal"
        gap="12p"
        style={buttonStyle}
        onPress={() => setIsVisible(true)}
        testID={testID !== undefined ? `${testID}-Box` : undefined}>
        {isLoading ? (
          <ActivityIndicator size="small" />
        ) : (
          <View style={styles.internelContent}>
            <Typography.Text
              color="neutralBase+30"
              weight="regular"
              size="callout"
              testID={testID !== undefined ? `${testID}-CurrentValue` : undefined}>
              {field.value === undefined
                ? reasons[0]?.Description
                : reasons.find(element => element.Code === field.value)?.Description}
            </Typography.Text>
            <AngleDownIcon color={iconColor} />
          </View>
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
        testID={testID !== undefined ? `${testID}-Dropdown` : undefined}
        isVisible={isVisible}
        value={field.value}
      />
    </View>
  ) : (
    <View style={styles.containerWidth}>
      <Picker
        testID={testID !== undefined ? `${testID}-Dropdown` : undefined}
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
          <Picker.Item
            testID={testID !== undefined ? `${testID}-${option.value}` : undefined}
            key={option.value}
            label={option.label}
            value={option.value}
            style={pickerAndroidItemStyle}
          />
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
        }}
        testID={testID !== undefined ? `${testID}-Box` : undefined}>
        {isLoading ? (
          <ActivityIndicator size="small" />
        ) : (
          <View style={styles.internelContent}>
            <Typography.Text
              color="neutralBase+30"
              weight="regular"
              size="callout"
              testID={testID !== undefined ? `${testID}-CurrentValue` : undefined}>
              {field.value === undefined
                ? reasons[0]?.Description
                : reasons.find(element => element.Code === field.value)?.Description}
            </Typography.Text>
            <AngleDownIcon color={iconColor} />
          </View>
        )}
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  containerWidth: {
    maxWidth: "100%",
  },
  internelContent: { flexDirection: "row", flex: 1, justifyContent: "space-between" },
  picker: {
    opacity: 0,
    position: "absolute",
  },
});
