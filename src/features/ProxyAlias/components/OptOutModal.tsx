import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, TextStyle, ViewStyle } from "react-native";
import * as Yup from "yup";

import Button from "@/components/Button";
import TextInput from "@/components/Form/TextInput";
import Modal from "@/components/Modal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import OptOutInformationIcon from "../assets/OptOutInformationIcon";

type ReasonType = {
  reason: string;
  isSelected: boolean;
};

interface OptOutModalProps {
  visible: boolean;
  onclose: () => void;
  onOptOut: (reason: string) => void;
}

export interface OtherReason {
  OtherReason: string;
}

const MAX_LENGTH_OTHER_REASON = 50;
const MIN_LENGTH_OTHER_REASON = 10;

export default function OptOutModal({ visible, onclose, onOptOut }: OptOutModalProps) {
  const { t } = useTranslation();

  const OPT_OUT_REASONS: Array<ReasonType> = [
    { reason: t("ProxyAlias.OptOutModal.reason1"), isSelected: false },
    { reason: t("ProxyAlias.OptOutModal.reason2"), isSelected: false },
    { reason: t("ProxyAlias.OptOutModal.reason3"), isSelected: false },
    { reason: t("ProxyAlias.OptOutModal.reason4"), isSelected: false },
  ];

  const reasonValidationSchema = Yup.object().shape({
    OtherReason: Yup.string()
      .required(t("ProxyAlias.OptOutModal.validationErrors.otherReason.required"))
      .min(MIN_LENGTH_OTHER_REASON, t("ProxyAlias.OptOutModal.validationErrors.otherReason.minimum"))
      .max(MAX_LENGTH_OTHER_REASON, t("ProxyAlias.OptOutModal.validationErrors.otherReason.maximum")),
  });

  const [reasons, setReasons] = useState(OPT_OUT_REASONS);

  useEffect(() => {
    if (!visible) {
      unSelectReasons();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const chipStyle = useThemeStyles<TextStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    borderRadius: theme.radii.medium,
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: theme.spacing["4p"],
    marginHorizontal: theme.spacing["4p"],
    borderWidth: 1,
    textAlign: "center",
    borderColor: theme.palette["neutralBase-30"],
  }));

  const chipSelectedStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    borderWidth: 2,
    borderColor: theme.palette["neutralBase+30"],
  }));

  const chipContainerStyles = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["12p"],
  }));

  const infoIconColor = useThemeStyles(theme => theme.palette.neutralBase);

  const infoTextStyles = useThemeStyles<TextStyle>(theme => ({
    marginVertical: theme.spacing["8p"],
  }));

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<OtherReason>({
    resolver: yupResolver(reasonValidationSchema),
    mode: "onBlur",
  });

  const handleSubmitOptOut = async (formValues: OtherReason) => {
    onOptOut(formValues.OtherReason);
  };

  const handleSubmitDirect = () => {
    const selectedReason = reasons.find(item => item.isSelected);
    if (selectedReason !== undefined) {
      onOptOut(selectedReason.reason);
    }
  };

  const handleReasonSelection = (index: number) => {
    const reasonsTemp = [...reasons];
    reasonsTemp.forEach(element => {
      element.isSelected = false;
    });
    reasonsTemp[index].isSelected = !reasonsTemp[index].isSelected;
    setReasons(reasonsTemp);
  };

  function unSelectReasons() {
    const reasonsTemp = [...reasons];
    reasonsTemp.forEach(element => {
      element.isSelected = false;
    });
    setReasons(reasonsTemp);
  }

  const isButtonEnabled = () => {
    const otherReasonFilled = reasons[reasons.length - 1].isSelected && isValid;
    let reasonSelectedButOther = false;
    for (let index = 0; index < reasons.length - 1; index++) {
      if (reasons[index].isSelected) {
        reasonSelectedButOther = true;
        break;
      }
    }
    return otherReasonFilled || reasonSelectedButOther;
  };

  const renderReasons = () => {
    const reasonElements = [];
    const lastIndex = reasons.length - 1;
    for (let index = 0; index < lastIndex; index++) {
      if (index < lastIndex - 1) {
        reasonElements.push(
          <Pressable onPress={() => handleReasonSelection(index)}>
            <Typography.Text style={[chipStyle, reasons[index].isSelected && chipSelectedStyle]}>
              {reasons[index].reason}
            </Typography.Text>
          </Pressable>
        );
      } else {
        const element = (
          <Stack direction="vertical" gap="16p" align="stretch" style={styles.reasonsHorizontal}>
            <Stack direction="horizontal" gap="4p">
              <Pressable onPress={() => handleReasonSelection(index)}>
                <Typography.Text style={[chipStyle, reasons[index].isSelected && chipSelectedStyle]}>
                  {reasons[index].reason}
                </Typography.Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  reset();
                  handleReasonSelection(index + 1);
                }}>
                <Typography.Text style={[chipStyle, reasons[index + 1].isSelected && chipSelectedStyle]}>
                  {reasons[index + 1].reason}
                </Typography.Text>
              </Pressable>
            </Stack>
            {reasons[index + 1].isSelected ? (
              <TextInput
                control={control}
                name="OtherReason"
                label={t("ProxyAlias.OptOutModal.placeholderOther")}
                showCharacterCount
                maxLength={50}
              />
            ) : null}
          </Stack>
        );
        reasonElements.push(element);
      }
    }
    return reasonElements;
  };

  const isOtherInputVisible = reasons[reasons.length - 1].isSelected;

  return (
    <Modal visible={visible} onClose={onclose} headerText={t("ProxyAlias.OptOutModal.title")}>
      <Stack direction="vertical" gap="12p" style={chipContainerStyles}>
        {renderReasons()}
      </Stack>
      <Button
        disabled={!isButtonEnabled()}
        onPress={isOtherInputVisible ? handleSubmit(handleSubmitOptOut) : handleSubmitDirect}>
        {t("ProxyAlias.OptOutModal.title")}
      </Button>
      <Stack direction="horizontal" align="center" justify="center" gap="4p">
        <OptOutInformationIcon color={infoIconColor} />
        <Typography.Text style={infoTextStyles} size="caption1" color="neutralBase+10" align="center">
          {t("ProxyAlias.OptOutModal.infoMessage")}
        </Typography.Text>
      </Stack>
    </Modal>
  );
}

const styles = StyleSheet.create({
  reasonsHorizontal: {
    alignSelf: "stretch",
  },
});
