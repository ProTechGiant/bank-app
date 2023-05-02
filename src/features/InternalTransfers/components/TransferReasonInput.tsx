import { useMemo, useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, ViewStyle } from "react-native";

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
  const [isVisible, setIsVisible] = useState(false);

  const buttonContainer = useThemeStyles<ViewStyle>(theme => ({
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

  return (
    <>
      <Stack as={Pressable} direction="horizontal" gap="12p" style={buttonContainer} onPress={() => setIsVisible(true)}>
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
  );
}
