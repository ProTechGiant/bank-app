import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  TextInputChangeEventData,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import * as Yup from "yup";

import { EditIcon } from "@/assets/icons";
import TextInput from "@/components/Form/TextInput";
import Typography from "@/components/Typography";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { palette } from "@/theme/values";
import { emojiRegExp, emojiSpaceAlphanumericQuoteRegExp, formatCurrency, makeMaskedName } from "@/utils";

import SarieBrandLogo from "../assets/brands_logo_sarie.png";
import { useTransferReasons } from "../hooks/query-hooks";
import { TransferAccount } from "../types";
import TransferReasonInput from "./TransferReasonInput";

interface ReviewTransferDetailProps {
  handleAddNote: (content: string) => void;
  sender: TransferAccount;
  recipient: TransferAccount;
  bankName: string;
  feeInc: string;
  VAT: string;
  amount: number;
  isLocalTransfer?: boolean;
  showSarieImage?: boolean;
}
interface InternalTransferInput {
  PaymentAmount: number;
  ReasonCode: string;
  content: string;
}

export default function ReviewTransferDetail({
  handleAddNote,
  sender,
  recipient,
  bankName,
  feeInc,
  VAT,
  amount,
  isLocalTransfer,
  showSarieImage,
}: ReviewTransferDetailProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { setReason, transferType, reason } = useInternalTransferContext();
  const [isContentTouched, setIsContentTouched] = useState(false);

  if (transferType === undefined) {
    throw new Error('Cannot access InternalTransferScreen without "transferType"');
  }
  const reasons = useTransferReasons();

  const validationSchema = useMemo(
    () =>
      Yup.object({
        content: Yup.string()
          .test("is-emojis-and-regex-valid", t("InternalTransfers.AddNoteScreen.onlyFiveEmojisAllowed"), value => {
            const emojiMatchesLength = value ? (value.match(emojiRegExp) || []).length < 27 : true;
            return emojiMatchesLength;
          })
          .max(49, t("InternalTransfers.AddNoteScreen.maxCharactersReached"))
          .matches(emojiSpaceAlphanumericQuoteRegExp, t("InternalTransfers.AddNoteScreen.required")),
      }).transform((originalValue, originalObject) => {
        // If the length is zero, skip the validation part
        if (originalObject.content && originalObject.content.length === 0) {
          return Yup.string();
        }
        return originalValue;
      }),
    [t]
  );

  const { control, watch, trigger, setValue, formState } = useForm<InternalTransferInput>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      content: "",
      PaymentAmount: 0,
      ReasonCode: reason || "1",
    },
  });

  const selectedReasonCode = watch("ReasonCode");
  const noteContent = watch("content");

  useEffect(() => {
    if (selectedReasonCode) {
      updateReason();
    } else {
      setReason(selectedReasonCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedReasonCode, reasons.data]);

  useEffect(() => {
    if (noteContent) handleAddNote(noteContent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteContent]);

  useEffect(() => {
    if (isContentTouched) {
      trigger("content");
    }
  }, [isContentTouched, trigger]);

  const handleEditIcon = () => {
    navigation.navigate("InternalTransfers.InternalTransferScreen", {
      inEditPhase: true,
      fromLocalReviewScreen: !!isLocalTransfer,
    });
  };

  const updateReason = () => {
    if (reasons.data?.TransferReason === undefined) return;
    const defaultReason = reasons.data.TransferReason[0]?.Code;
    const selectedReason = selectedReasonCode ?? defaultReason;
    if (selectedReason === undefined) {
      return;
    }
    setReason(selectedReason);
  };

  const handleInputChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setValue("content", e.nativeEvent.text);
    setIsContentTouched(true);
  };

  const handleOnClear = () => {
    setValue("content", "");
    setIsContentTouched(true);
    if (!formState.isDirty) {
      setValue("content", "", { shouldDirty: true });
    }
    trigger("content");
  };

  const verticalSpaceStyle = useThemeStyles<TextStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
  }));

  const inputParent = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["12p"],
  }));

  const inlineText = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: theme.spacing["16p"],
  }));

  const separatorStyle = useThemeStyles<ViewStyle>(theme => ({
    height: 1,
    backgroundColor: theme.palette["neutralBase-40"],
    marginHorizontal: -theme.spacing["20p"],
  }));

  const transferBox = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["20p"],
    height: 58,
    width: "100%",
    flexDirection: "row",
    borderRadius: theme.spacing["12p"],
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.palette["neutralBase-40"],
    paddingHorizontal: theme.spacing["16p"],
  }));

  const optionalTextStyle = useThemeStyles<ViewStyle>(theme => ({
    marginLeft: theme.spacing["16p"],
    marginTop: theme.spacing["4p"],
  }));

  const logoImageStyle = useThemeStyles<TextStyle>(theme => ({
    height: theme.spacing["64p"],
    width: 80,
    alignSelf: "center",
  }));

  return (
    <View style={styles.container}>
      <View style={styles.headerStyle}>
        <Typography.Text color="neutralBase+30" weight="semiBold" size="title1">
          {t("InternalTransfers.ReviewTransferScreen.title")}
        </Typography.Text>
        {isLocalTransfer && showSarieImage && (
          <Image source={SarieBrandLogo} resizeMode="cover" style={logoImageStyle} />
        )}
      </View>
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
      <View style={verticalSpaceStyle}>
        <Typography.Text weight="medium" size="callout">
          {t("InternalTransfers.ReviewTransferScreen.to")}
        </Typography.Text>
        <Typography.Text color="neutralBase" weight="medium" size="callout">
          {isLocalTransfer ? makeMaskedName(recipient.accountName || "") : recipient.accountName}
        </Typography.Text>
        <Typography.Text color="neutralBase" weight="medium" size="callout">
          {recipient.accountNumber}
        </Typography.Text>
      </View>
      <View style={separatorStyle} />

      <View style={transferBox}>
        <View>
          <Typography.Text color="neutralBase+10" size="callout">
            {t("InternalTransfers.ReviewTransferDetailScreen.transferAmount")}
          </Typography.Text>
          <Typography.Text color="neutralBase+30" size="callout">
            {formatCurrency(Number(amount), t("InternalTransfers.ReviewTransferDetailScreen.currency"))}
          </Typography.Text>
        </View>
        <Pressable onPress={handleEditIcon} testID="InternalTransfers.ReviewTransferScreen:EditTransferAmount">
          <EditIcon color={palette.complimentBase} />
        </Pressable>
      </View>

      <View style={inlineText}>
        <Typography.Text size="body">{t("InternalTransfers.ReviewTransferDetailScreen.bank")}</Typography.Text>
        <Typography.Text size="body">{bankName}</Typography.Text>
      </View>

      <View style={inlineText}>
        <Typography.Text size="body">{t("InternalTransfers.ReviewTransferDetailScreen.fee")}</Typography.Text>
        <Typography.Text size="body">
          {formatCurrency(Number(feeInc), t("InternalTransfers.ReviewTransferDetailScreen.currency"))}
        </Typography.Text>
      </View>

      <View style={inlineText}>
        <Typography.Text size="body">{t("InternalTransfers.ReviewTransferDetailScreen.vat")}</Typography.Text>
        <Typography.Text size="body">
          {formatCurrency(Number(VAT), t("InternalTransfers.ReviewTransferDetailScreen.currency"))}
        </Typography.Text>
      </View>

      <View style={inlineText}>
        <Typography.Text size="body">{t("InternalTransfers.ReviewTransferScreen.total")}</Typography.Text>
        {amount === undefined ? (
          <ActivityIndicator size="small" />
        ) : (
          <Typography.Text weight="semiBold" size="body" testID="InternalTransfers.ReviewTransferScreen:total">
            {formatCurrency(
              Number(amount) + Number(feeInc) + Number(VAT),
              t("InternalTransfers.ReviewTransferDetailScreen.currency")
            )}
          </Typography.Text>
        )}
      </View>

      <Typography.Text weight="semiBold" size="callout">
        {t("InternalTransfers.ReviewTransferDetailScreen.transferPurpose")}
      </Typography.Text>

      <TransferReasonInput
        isLoading={reasons.isLoading}
        reasons={reasons.data?.TransferReason ?? []}
        control={control}
        name="ReasonCode"
        testID="InternalTransfers.ReviewTransferScreen:TransferReasonInput"
      />

      <View style={inputParent}>
        <TextInput
          control={control}
          label={t("InternalTransfers.AddNoteScreen.placeholder")}
          name="content"
          maxLength={50}
          multiline
          numberOfLines={3}
          autoCorrect={false}
          showCharacterCount
          testID="InternalTransfers.ReviewTransferScreen:ContentInput"
          onBlur={() => setIsContentTouched(true)}
          onChange={e => handleInputChange(e)}
          onClear={handleOnClear}
        />
        <Typography.Text color="neutralBase-20" style={optionalTextStyle} size="footnote">
          {t("InternalTransfers.ReviewTransferDetailScreen.optional")}
        </Typography.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  headerStyle: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
