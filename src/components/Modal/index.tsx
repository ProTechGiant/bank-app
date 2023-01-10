import { Modal as RNModal, ModalProps as RNModalProps, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { CloseIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface ModalProps extends Omit<RNModalProps, "animationType" | "onRequestClose" | "transparent"> {
  onClose?: () => void;
  headerText: string;
}

export default function Modal({ children, onClose, headerText, ...nativeModalProps }: ModalProps) {
  const containerStyles = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["neutralBase-50"],
      borderTopLeftRadius: theme.radii.small * 1.5,
      borderTopRightRadius: theme.radii.small * 1.5,
      height: "43%",
      marginTop: "auto",
    }),
    []
  );

  const headerStyles = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      borderBottomColor: theme.palette["neutralBase-30"],
      borderBottomWidth: 1,
      flexDirection: "row",
      height: 60,
      justifyContent: "space-between",
    }),
    []
  );

  const horizontalSpacing = useThemeStyles<ViewStyle>(
    theme => ({
      marginHorizontal: theme.spacing.regular,
    }),
    []
  );

  return (
    <RNModal onRequestClose={onClose} transparent {...nativeModalProps}>
      <Pressable onPress={onClose} style={styles.backdrop} />
      <View style={containerStyles}>
        <View style={headerStyles}>
          <View style={horizontalSpacing} />
          <View style={styles.headerTextContainer}>
            <Typography.Text color="neutralBase+30" size="callout" weight="medium">
              {headerText}
            </Typography.Text>
          </View>
          <View style={horizontalSpacing}>
            {undefined !== onClose && (
              <Pressable hitSlop={HIT_SLOP_RIGHT} onPress={onClose}>
                <CloseIcon />
              </Pressable>
            )}
          </View>
        </View>
        <View style={horizontalSpacing}>{children}</View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  headerTextContainer: {
    alignItems: "center",
    flexGrow: 1,
  },
});

const HIT_SLOP_RIGHT = { top: 10, bottom: 10, left: 0, right: 10 };
