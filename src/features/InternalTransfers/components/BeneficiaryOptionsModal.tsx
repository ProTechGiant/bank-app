import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import { DeleteIcon } from "@/assets/icons";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import NotificationModal from "@/components/NotificationModal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface BeneficiaryOptionsModalProps {
  name: string;
  onCloseMenu: () => void;
  isMenuVisible: boolean;
  onOpenDeleteConfirm: () => void;
  onDelete: () => void;
  onCloseConfirmDelete: () => void;
  isConfirmDeleteVisible: boolean;
  isLoading?: boolean;
  testID?: string;
}

export default function BeneficiaryOptionsModal({
  name,
  onCloseMenu,
  isMenuVisible,
  onOpenDeleteConfirm,
  onDelete,
  onCloseConfirmDelete,
  isConfirmDeleteVisible,
  isLoading = false,
  testID,
}: BeneficiaryOptionsModalProps) {
  const { t } = useTranslation();

  const menuContainer = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["32p"],
    borderTopWidth: 1,
    borderTopColor: theme.palette["neutralBase-30"],
  }));

  return (
    <Modal onClose={onCloseMenu} headerText={name} visible={isMenuVisible} testID={testID}>
      <View style={menuContainer}>
        <Pressable onPress={onOpenDeleteConfirm} testID={testID !== undefined ? `${testID}-DeleteButton` : undefined}>
          <Stack direction="horizontal" align="center" gap="16p">
            <DeleteIcon />
            <Typography.Text size="callout" weight="medium" color="errorBase">
              {t("InternalTransfers.SendToBeneficiaryScreen.menu.deleteOption")}
            </Typography.Text>
          </Stack>
        </Pressable>
      </View>
      <NotificationModal
        variant="confirmations"
        buttons={{
          primary: (
            <Button
              loading={isLoading}
              disabled={isLoading}
              onPress={onDelete}
              testID={testID !== undefined ? `${testID}-ConfirmDeleteButton` : undefined}>
              {t("InternalTransfers.SendToBeneficiaryScreen.menu.deleteModal.deleteButton")}
            </Button>
          ),
          secondary: (
            <Button
              onPress={onCloseConfirmDelete}
              testID={testID !== undefined ? `${testID}-CancelDeleteButton` : undefined}>
              {t("InternalTransfers.SendToBeneficiaryScreen.menu.deleteModal.cancelButton")}
            </Button>
          ),
        }}
        message={t("InternalTransfers.SendToBeneficiaryScreen.menu.deleteModal.message")}
        title={t("InternalTransfers.SendToBeneficiaryScreen.menu.deleteModal.title", { name: name })}
        isVisible={isConfirmDeleteVisible}
      />
    </Modal>
  );
}
