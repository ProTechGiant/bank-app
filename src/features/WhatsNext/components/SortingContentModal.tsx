import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import Modal from "@/components/Modal";
import { RadioButton, RadioButtonGroup } from "@/components/RadioButton";
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

  const modalStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
  }));

  return (
    <Modal visible={isVisible} style={modalStyle} onClose={onClose} headerText={t("WhatsNext.SortingContent.title")}>
      <View>
        <RadioButtonGroup onPress={value => onChange(value)} value={sortOrder}>
          <RadioButton label={t("WhatsNext.SortingContent.newest")} value={SORT_NEWEST} />
          <RadioButton label={t("WhatsNext.SortingContent.oldest")} value={SORT_OLDEST} />
        </RadioButtonGroup>
      </View>
    </Modal>
  );
}
