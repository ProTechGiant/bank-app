import Clipboard from "@react-native-clipboard/clipboard";
import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import { CopyIcon } from "@/assets/icons";
import Modal from "@/components/Modal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useToasts } from "@/contexts/ToastsContext";
import { useThemeStyles } from "@/theme";

import AccountIcon from "../assets/AccountIcon";

interface AccountModalProps {
  visible: boolean;
  onClose: () => void;
  accountNumber: string;
  fullName: {
    FirstName: string;
    SecondName: string;
    LastName: string;
  };
}

export default function AccountModal({ onClose, visible, accountNumber, fullName }: AccountModalProps) {
  const { t } = useTranslation();

  const addToast = useToasts();

  const handleOnCopyPress = (value: string, label: string) => {
    Clipboard.setString(value);

    addToast({
      variant: "confirm",
      message: t("ProxyAlias.AccountModal.success", { dataCopied: label }),
    });

    onClose();
  };

  const modalContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["48p"],
  }));

  const accountIconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: theme.spacing["48p"],
    height: theme.spacing["48p"],
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.radii.xxlarge,
    alignItems: "center",
    justifyContent: "center",
  }));

  const nameContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
    paddingVertical: theme.spacing["16p"],
  }));

  const accountIconColor = useThemeStyles(theme => theme.palette.complimentBase);

  const copyIconColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);

  return (
    <Modal
      style={modalContainerStyle}
      headerText={t("ProxyAlias.AliasManagementScreen.accountInformation")}
      visible={visible}
      onClose={onClose}>
      <Stack direction="horizontal" gap="16p" align="center" style={nameContainerStyle}>
        <View style={accountIconContainerStyle}>
          <AccountIcon color={accountIconColor} />
        </View>

        <Stack direction="vertical">
          <Typography.Text size="footnote" weight="regular" color="neutralBase">
            {t("ProxyAlias.AccountModal.fullName")}
          </Typography.Text>
          <Typography.Text size="callout" weight="regular" color="neutralBase+30" numberOfLines={2}>
            {fullName.FirstName} {fullName.SecondName} {fullName.LastName}
          </Typography.Text>
        </Stack>
      </Stack>

      <Stack direction="horizontal" gap="16p" align="center" justify="space-between">
        <Stack direction="vertical">
          <Typography.Text size="footnote" weight="regular" color="neutralBase">
            {t("ProxyAlias.AccountModal.accountNumber")}
          </Typography.Text>
          <Typography.Text size="callout" weight="regular" color="neutralBase+30">
            {accountNumber}
          </Typography.Text>
        </Stack>

        <Pressable onPress={() => handleOnCopyPress(accountNumber, `${t("ProxyAlias.AccountModal.accountNumber")}`)}>
          <CopyIcon color={copyIconColor} />
        </Pressable>
      </Stack>
    </Modal>
  );
}
