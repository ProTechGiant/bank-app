import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TextStyle, ViewStyle } from "react-native";
import * as Yup from "yup";

import Button from "@/components/Button";
import TextInput from "@/components/Form/TextInput";
import Modal from "@/components/Modal";
import { RadioButton, RadioButtonGroup } from "@/components/RadioButton";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { OptOutInformationIcon } from "../assets";

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
const MIN_LENGTH_OTHER_REASON = 5;

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
  const [selectedReasonIndex, setSelectedReasonIndex] = useState<number>(-1);

  useEffect(() => {
    if (!visible) {
      unSelectReasons();
      setSelectedReasonIndex(-1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const chipContainerStyles = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["12p"],
    alignItems: "stretch",
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
    setSelectedReasonIndex(index);
    if (index !== reasons.length - 1) {
      reset({ OtherReason: "" });
    }
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

  const isOtherReasonSelected = reasons[reasons.length - 1].isSelected;

  const isButtonEnabled = () => {
    let reasonSelectedButOther = false;
    for (let index = 0; index < reasons.length - 1; index++) {
      if (reasons[index].isSelected) {
        reasonSelectedButOther = true;
        break;
      }
    }
    return (isOtherReasonSelected && isValid) || reasonSelectedButOther;
  };

  const renderReasons = () => (
    <>
      <RadioButtonGroup onPress={index => handleReasonSelection(index)} value={selectedReasonIndex}>
        {reasons.map((item, index) => (
          <RadioButton label={item.reason} value={index} />
        ))}
      </RadioButtonGroup>
      {isOtherReasonSelected && (
        <TextInput
          control={control}
          name="OtherReason"
          label={t("ProxyAlias.OptOutModal.placeholderOther")}
          showCharacterCount
          maxLength={50}
          multiline={true}
          numberOfLines={2}
          extraStart={t("ProxyAlias.OptOutModal.validationErrors.otherReason.minimum")}
        />
      )}
    </>
  );

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
