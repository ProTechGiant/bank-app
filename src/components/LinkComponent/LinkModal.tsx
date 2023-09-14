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
  hasCloseIcon?: boolean;
}

const LinkModal = ({ modalVisible, toggleModal, onNavigate, children, linkText, hasCloseIcon }: LinkModalProps) => {
  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["32p"],
  }));

  const modalViewStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-50"],
    maxWidth: 348,
    padding: theme.spacing["24p"],
    width: "100%",
    borderRadius: theme.radii.xlarge,
    borderTopStartRadius: theme.radii.xlarge,
    borderTopEndRadius: theme.radii.xlarge,
    marginBottom: theme.spacing["32p"],
    marginHorizontal: theme.spacing["16p"],
  }));

  const handlePress = () => {
    toggleModal && toggleModal();
    onNavigate();
  };

  return (
    <Modal transparent={true} visible={modalVisible} onRequestClose={toggleModal}>
      <View style={styles.centeredView}>
        <View style={modalViewStyle}>
          {hasCloseIcon ? (
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <CloseIcon />
            </TouchableOpacity>
          ) : null}
          {children}
          <View style={buttonContainerStyle}>
            <Button onPress={handlePress} testID="Onboarding.NafathAuthScreen:OpenNafathAppButton">
              {linkText}
            </Button>
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
    justifyContent: "flex-end",
  },
  closeButton: {
    alignItems: "flex-end",
  },
});
