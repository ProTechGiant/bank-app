import { useState } from "react";
import { Control, useController } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import { ChevronBottomIcon } from "@/assets/icons";
import { Modal, Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import { RadioButton, RadioButtonGroup } from "@/components/RadioButton";
import { useThemeStyles } from "@/theme";

import { FinancialDetails } from "../types";

interface test {
  value: string;
  label: string;
}

interface DropDownModalProps {
  options: test[];
  control: Control<FinancialDetails, any>;
  name: "OccupationCode" | "AccountPurpose" | "SourceOfIncome" | "MonthlyLimit";
  placeholder: string;
  extra?: string;
  label: string;
}
export default function DropDownModal({ options, control, name, placeholder, extra, label }: DropDownModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selecteValue, setSelectedValue] = useState();
  const [selectedItem, setSelectedItem] = useState<string>();
  const { field } = useController({ control, name });
  const { t } = useTranslation();

  const marginStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
  }));

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.radii.regular,
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["12p"],
    marginTop: theme.spacing["8p"],
    marginBottom: theme.spacing["4p"],
  }));

  const extraContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["32p"],
    paddingBottom: theme.spacing["4p"],
  }));

  const handleOnSelect = () => {
    setIsVisible(false);
    const result = options.find(option => option.value === selecteValue);
    if (result) {
      setSelectedItem(result.label);
      field.onChange(result.label);
    }
  };

  const handleOnClose = () => {
    setIsVisible(false);
  };

  return (
    <>
      <Pressable onPress={() => setIsVisible(true)} style={marginStyle}>
        <Typography.Text size="callout" weight="medium">
          {label}
        </Typography.Text>
        <Stack direction="horizontal" justify="space-between" style={containerStyle}>
          {selectedItem ? (
            <Typography.Text size="callout" weight="regular">
              {selectedItem}
            </Typography.Text>
          ) : (
            <Typography.Text color="neutralBase" size="callout" weight="regular">
              {placeholder}
            </Typography.Text>
          )}

          <ChevronBottomIcon color="#ACABBA" />
        </Stack>
        {extra ? (
          <View style={extraContainerStyle}>
            <Typography.Text color="neutralBase" size="caption1" weight="regular">
              {extra}
            </Typography.Text>
          </View>
        ) : null}
      </Pressable>
      <Modal
        visible={isVisible}
        onClose={handleOnClose}
        headerText={t("Onboarding.FinancialInformationScreen.selectAmount")}
        style={{ height: "50%" }}>
        <View style={{ height: "60%" }}>
          <ContentContainer isScrollView>
            {options ? (
              <RadioButtonGroup onPress={value => setSelectedValue(value)} value={selecteValue}>
                {options.map(option => {
                  return <RadioButton key={option.value} label={option.label} value={option.value} />;
                })}
              </RadioButtonGroup>
            ) : null}
          </ContentContainer>
        </View>
        <View style={buttonContainerStyle}>
          <Button onPress={handleOnSelect}>{t("Onboarding.FinancialInformationScreen.set")}</Button>
        </View>
      </Modal>
    </>
  );
}
