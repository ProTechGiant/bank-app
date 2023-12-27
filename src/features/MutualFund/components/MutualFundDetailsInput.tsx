import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { TextInput, ViewStyle } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

interface MutualFundDetailsInputProps {
  title: string;
  inputValue: string;
  handleOnChange: Dispatch<SetStateAction<string>>;
  editable?: boolean;
  showInfoIcon?: boolean;
}

export default function MutualFundDetailsInput({
  title,
  handleOnChange,
  inputValue,
  editable,
  showInfoIcon,
}: MutualFundDetailsInputProps) {
  const { t } = useTranslation();

  const textInputStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: 0,
    color: theme.palette["neutralBase-60"],
    fontSize: theme.typography.text.sizes.title1,
    height: 30,
  }));

  const infoIconStyle = useThemeStyles<string>(theme => theme.palette["neutralBase-60"]);

  const handleOnTextInputChange = (value: string) => {
    let inputValue = value.replace(/[^0-9.]/g, "");
    inputValue = inputValue.replace(/(\..*)\./g, "$1");

    if (inputValue === ".") {
      inputValue = "0.";
    }
    handleOnChange(inputValue);
  };

  const handleOnEndEditing = () => {
    const numericValue = parseFloat(inputValue.replace(/,/g, ""));
    if (!isNaN(numericValue)) {
      const localizedValue = numericValue.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      handleOnChange(localizedValue);
    } else {
      handleOnChange("0.00");
    }
  };

  return (
    <Stack direction="vertical" gap="16p">
      <Stack direction="horizontal" gap="4p">
        <Typography.Text size="footnote" color="neutralBase-60" weight="regular">
          {title}
        </Typography.Text>
        {showInfoIcon ? <InfoCircleIcon color={infoIconStyle} /> : null}
      </Stack>
      <Stack direction="horizontal" gap="8p" align="center">
        <TextInput
          style={textInputStyle}
          value={inputValue}
          onChangeText={handleOnTextInputChange}
          onEndEditing={handleOnEndEditing}
          keyboardType="numeric"
          maxLength={15}
          editable={editable}
        />
        <Typography.Text size="title3" weight="bold" color="neutralBase-40">
          {t("MutualFund.MutualFundDetailsScreen.ProgressBar.currency")}
        </Typography.Text>
      </Stack>
    </Stack>
  );
}
