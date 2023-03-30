import { useTranslation } from "react-i18next";
import { Image, StyleSheet, View, ViewStyle } from "react-native";

import Modal from "@/components/Modal";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import StandardCardCVV from "../assets/standard-card-cvv.png";

interface ViewCVVModelProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function ViewCVVModel({ isVisible: visible, onClose }: ViewCVVModelProps) {
  const { t } = useTranslation();

  const modalStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["32p"],
    alignItems: "center",
  }));

  return (
    <Modal style={modalStyle} onClose={onClose} visible={visible} headerText={t("CardActions.EnterCardCVVScreen.hint")}>
      <View style={styles.cardStyle}>
        <Image resizeMode="contain" source={StandardCardCVV} />
      </View>
      <Typography.Text size="callout" weight="medium" align="left">
        {t("CardActions.EnterCardCVVScreen.cvvNote")}
      </Typography.Text>
    </Modal>
  );
}

const styles = StyleSheet.create({
  cardStyle: {
    alignItems: "center",
  },
});
