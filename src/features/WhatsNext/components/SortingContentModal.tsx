import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { RadioButton, RadioButtonGroup } from "@/components/RadioButton";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { SORT_NEWEST, SORT_OLDEST } from "../constants";

interface SortingContentModalProps {
  onClose: () => void;
  isVisible: boolean;
  onChange: (value: typeof SORT_NEWEST | typeof SORT_OLDEST) => void;
  sortOrder: typeof SORT_NEWEST | typeof SORT_OLDEST;
}

export default function SortingContentModal({ onClose, isVisible, onChange, sortOrder }: SortingContentModalProps) {
  const { t } = useTranslation();

  const [selected, setSelected] = useState<typeof SORT_NEWEST | typeof SORT_OLDEST>(sortOrder);

  const modalStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
  }));

  return (
    <Modal visible={isVisible} style={modalStyle} onClose={onClose} headerText={t("WhatsNext.SortingContent.title")}>
      <View>
        <RadioButtonGroup onPress={value => setSelected(value)} value={selected}>
          <RadioButton label={t("WhatsNext.SortingContent.newest")} value={SORT_NEWEST} />
          <RadioButton label={t("WhatsNext.SortingContent.oldest")} value={SORT_OLDEST} />
        </RadioButtonGroup>
      </View>
      <View style={buttonContainerStyle}>
        <Button onPress={() => onChange(selected)}>
          <Typography.Text color="neutralBase-60" size="footnote">
            {t("WhatsNext.SortingContent.apply")}
          </Typography.Text>
        </Button>
      </View>
    </Modal>
  );
}
