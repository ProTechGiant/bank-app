import React from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import { EditIcon, PlusIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import { useThemeStyles } from "@/theme";
import { TransferType } from "@/types/InternalTransfer";
import { makeMaskedName } from "@/utils";

import { Note, TransferAccount } from "../types";

interface ReviewTransferDetailProps {
  onAddNotePress: () => void;
  sender: TransferAccount;
  recipient: TransferAccount;
  reason: string;
  amount: number;
  note: Note;
}

export default function ReviewTransferDetail({
  onAddNotePress,
  sender,
  recipient,
  reason,
  amount,
  note,
}: ReviewTransferDetailProps) {
  const { t } = useTranslation();
  const { transferType } = useInternalTransferContext();

  const titleStyle = useThemeStyles<TextStyle>(theme => ({
    paddingBottom: theme.spacing["16p"],
  }));
  const verticalSpaceStyle = useThemeStyles<TextStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
  }));

  const inlineText = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: theme.spacing["16p"],
  }));

  const notesContainer = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    paddingVertical: theme.spacing["16p"],
  }));

  const separatorStyle = useThemeStyles<ViewStyle>(theme => ({
    height: 1,
    backgroundColor: theme.palette["neutralBase-40"],
    marginHorizontal: -theme.spacing["20p"],
  }));

  const plusIconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["supportBase-15"],
    borderRadius: theme.radii.xlarge,
    padding: theme.spacing["8p"],
  }));

  const plusIconColor = useThemeStyles(theme => theme.palette["primaryBase-30"]);

  const editIconColor = useThemeStyles(theme => theme.palette["primaryBase-40"]);

  const isNoteExists = note.attachment.length > 0 || note.content.length > 0;

  return (
    <View>
      <Typography.Text color="neutralBase+30" weight="semiBold" size="title1" style={titleStyle}>
        {t("InternalTransfers.ReviewTransferScreen.title")}
      </Typography.Text>

      <View style={verticalSpaceStyle}>
        <Typography.Text weight="medium" size="callout">
          {t("InternalTransfers.ReviewTransferScreen.from")}
        </Typography.Text>
        <Typography.Text color="neutralBase" weight="medium" size="callout">
          {sender.accountName || ""}
        </Typography.Text>
        <Typography.Text color="neutralBase" weight="medium" size="callout">
          {sender.accountNumber}
        </Typography.Text>
      </View>
      <View style={separatorStyle} />
      <View style={verticalSpaceStyle}>
        <Typography.Text weight="medium" size="callout">
          {t("InternalTransfers.ReviewTransferScreen.to")}
        </Typography.Text>
        <Typography.Text color="neutralBase" weight="medium" size="callout">
          {makeMaskedName(recipient.accountName || "")}
        </Typography.Text>
        <Typography.Text color="neutralBase" weight="medium" size="callout">
          {recipient.accountNumber}
        </Typography.Text>
      </View>
      <View style={separatorStyle} />
      <View style={inlineText}>
        <Typography.Text weight="medium" size="callout">
          {t("InternalTransfers.ReviewTransferScreen.reason")}
        </Typography.Text>
        <Typography.Text color="neutralBase" weight="medium" size="callout">
          {reason}
        </Typography.Text>
      </View>

      <View style={inlineText}>
        <Typography.Text weight="semiBold" size="body">
          {t("InternalTransfers.ReviewTransferScreen.total")}
        </Typography.Text>
        <Typography.Text weight="semiBold" size="body">
          {amount}
        </Typography.Text>
      </View>
      <View style={separatorStyle} />
      {transferType !== TransferType.CroatiaToArbTransferAction ? (
        <>
          <View style={notesContainer}>
            <Typography.Text weight="medium" size="callout">
              {t("InternalTransfers.ReviewTransferScreen.notes") + " "}
            </Typography.Text>
            <Typography.Text color="neutralBase" weight="medium" size="callout">
              {t("InternalTransfers.ReviewTransferScreen.optional")}
            </Typography.Text>
          </View>
          {!isNoteExists ? (
            <Stack direction="horizontal">
              <Pressable
                style={plusIconContainerStyle}
                onPress={onAddNotePress}
                testID="InternalTransfers.ReviewTransferDetail:AddNoteButton">
                <PlusIcon color={plusIconColor} width={20} height={20} />
              </Pressable>
            </Stack>
          ) : (
            <View style={styles.noteContainer}>
              <Typography.Text color="neutralBase" size="callout">
                {note.content}
              </Typography.Text>
              <Pressable style={styles.chevronContainer} onPress={onAddNotePress}>
                <EditIcon color={editIconColor} />
              </Pressable>
            </View>
          )}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  chevronContainer: {
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
  noteContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
