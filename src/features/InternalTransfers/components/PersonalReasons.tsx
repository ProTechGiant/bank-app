import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import { AngleDownIcon } from "@/assets/icons";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { TransferReason } from "../types";

interface PersonalReasonsProps<T extends FieldValues> {
  reasons: TransferReason[];
  control: Control<T>;
  name: Path<T>;
}

export default function PersonalReasons<T extends FieldValues>({ reasons, control, name }: PersonalReasonsProps<T>) {
  const { t } = useTranslation();
  const { field } = useController({ control, name });
  const [isVisible, setIsVisible] = useState(false);
  const [text, setText] = useState(t("InternalTransfers.InternalTransferScreen.reason"));
  const [selectedValue, setSelectedValue] = useState(field.value.code); //code for reason refferring table
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOnPressButton = () => {
    setIsVisible(true);
  };

  const handleOnClose = () => {
    setIsVisible(false);
  };

  const handleOnConfirm = () => {
    setIsVisible(false);
    setText(reasons[currentIndex].Description);
    field.onChange({ Description: reasons[currentIndex].Description, Code: selectedValue });
  };

  const onValueChange = (itemValue: string, itemIndex: number) => {
    setSelectedValue(itemValue);
    setCurrentIndex(itemIndex);
  };

  const container = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
    marginBottom: 56,
    marginHorizontal: theme.spacing["20p"],
  }));

  const buttonContainer = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "flex-start",
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: 9.5,
  }));

  const textStyle = useThemeStyles<TextStyle>(theme => ({
    marginRight: theme.spacing["12p"],
  }));

  const modalStyle = useThemeStyles<TextStyle>(theme => ({
    paddingBottom: theme.spacing["16p"],
  }));

  const iconColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);

  return (
    <View>
      <View style={container}>
        <Pressable style={buttonContainer} onPress={handleOnPressButton}>
          <Typography.Text weight="medium" size="callout" style={textStyle}>
            {text}
          </Typography.Text>
          <AngleDownIcon color={iconColor} />
        </Pressable>
      </View>
      <Modal onClose={handleOnClose} headerText="Select category" visible={isVisible} style={modalStyle}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedValue}
            style={styles.pickerStyle}
            onValueChange={(itemValue, itemIndex) => onValueChange(itemValue, itemIndex)}>
            {reasons.map(reason => {
              return <Picker.Item label={reason.Description} value={reason.Code} key={reason.Code} />;
            })}
          </Picker>
        </View>
        <Button onPress={handleOnConfirm}>{t("InternalTransfers.InternalTransferScreen.ok")}</Button>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    alignItems: "center",
    height: 200,
    justifyContent: "center",
  },
  pickerStyle: {
    height: 200,
    width: "100%",
  },
});
