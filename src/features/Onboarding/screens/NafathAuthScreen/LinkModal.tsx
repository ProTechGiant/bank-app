import { Modal, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

import { CloseIcon } from "@/assets/icons";
import Button from "@/components/Button";
import { useThemeStyles } from "@/theme";

interface LinkModalProps {
  modalVisible: boolean;
  toggleModal?: () => void;
  onNavigate: () => void;
  children: JSX.Element | JSX.Element[];
  linkText: string;
}

const LinkModal = ({ modalVisible, toggleModal, onNavigate, children, linkText }: LinkModalProps) => {
  const buttonContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginTop: theme.spacing.small,
    }),
    []
  );
  const modalViewStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["neutralBase-50"],
      borderRadius: theme.radii.extraSmall,
      maxWidth: 348,
      padding: theme.spacing.large,
      width: "100%",
    }),
    []
  );

  const handlePress = () => {
    toggleModal && toggleModal();
    onNavigate();
  };

  return (
    <Modal transparent={true} visible={modalVisible} onRequestClose={toggleModal}>
      <View style={styles.centeredView}>
        <View style={modalViewStyle}>
          <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
            <CloseIcon />
          </TouchableOpacity>
          {children}
          <View style={buttonContainerStyle}>
            <Button onPress={handlePress}>{linkText}</Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LinkModal;

const styles = StyleSheet.create({
  centeredView: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.51)",
    flex: 1,
    justifyContent: "center",
  },
  closeButton: {
    alignItems: "flex-end",
  },
});
