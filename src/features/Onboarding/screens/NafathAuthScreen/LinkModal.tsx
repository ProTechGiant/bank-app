import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

import { CloseIcon } from "@/assets/icons";

import Button from "@/components/Button";
import { palette, radii, spacing } from "@/theme/values";

interface LinkModalProps {
  modalVisible: boolean;
  toggleModal?: () => void;
  onNavigate: () => void;
  children: JSX.Element | JSX.Element[];
  linkText: string;
}

const LinkModal = ({ modalVisible, toggleModal, onNavigate, children, linkText }: LinkModalProps) => {
  const handlePress = () => {
    toggleModal && toggleModal();
    onNavigate();
  };

  return (
    <Modal transparent={true} visible={modalVisible} onRequestClose={toggleModal}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
            <CloseIcon />
          </TouchableOpacity>
          {children}
          <View style={styles.buttonContainer}>
            <Button onPress={handlePress}>{linkText}</Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LinkModal;

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: spacing.small,
  },
  centeredView: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.51)",
    flex: 1,
    justifyContent: "center",
  },
  closeButton: {
    alignItems: "flex-end",
  },
  modalView: {
    backgroundColor: palette["neutralBase-50"],
    borderRadius: radii.extraSmall,
    maxWidth: 348,
    padding: spacing.large,
    width: "100%",
  },
});
