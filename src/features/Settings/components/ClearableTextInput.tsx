import React, { useEffect, useRef, useState } from "react";
import { I18nManager, Pressable, StyleSheet, TextInput, View, ViewStyle } from "react-native";

import { EditIcon } from "@/assets/icons";
import { Typography } from "@/components";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import { useThemeStyles } from "@/theme";

import { CancelIcon } from "../assets/icons/CancelIcon";

interface ClearableTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing?: () => Promise<boolean>;
  isLoading: boolean;
  initialText?: string;
}

const ClearableTextInput = ({
  value,
  onChangeText,
  onSubmitEditing,
  isLoading,
  initialText = "",
}: ClearableTextInputProps) => {
  const inputRef = useRef<TextInput>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(value !== "" ? value : initialText);

  useEffect(() => {
    setEditedText(value !== "" ? value : initialText);
  }, [value, initialText]);

  const handleEditClick = () => {
    setEditedText(value);
    onChangeText(editedText);
    setIsEditing(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleEditingClose = async () => {
    onChangeText("");
    setIsEditing(false);
  };

  const handleClear = () => {
    onChangeText("");
    if (inputRef.current) inputRef.current.focus();
  };

  const editInputStyle = useThemeStyles<ViewStyle>(theme => ({
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 12,
    paddingStart: 14,
    paddingVertical: theme.spacing["12p"],
    width: "100%",
    flex: 1,
    textAlign: I18nManager.isRTL ? "right" : "left",
  }));

  const editIconColor = useThemeStyles(theme => theme.palette.primaryBase);

  return (
    <>
      {!isEditing ? (
        isLoading ? (
          <FlexActivityIndicator />
        ) : (
          <>
            <Typography.Text size="title2" weight="medium">
              {editedText}
            </Typography.Text>
            <Pressable onPress={handleEditClick}>
              <EditIcon color={editIconColor} />
            </Pressable>
          </>
        )
      ) : (
        <View style={styles.editTextContainer}>
          <TextInput
            ref={inputRef}
            style={editInputStyle}
            onChangeText={onChangeText}
            onFocus={() => setIsEditing(true)}
            onBlur={handleEditingClose}
            value={value}
            onSubmitEditing={onSubmitEditing}
            autoFocus={isEditing}
          />
          <Pressable onPress={handleClear} style={styles.iconStyle}>
            <CancelIcon />
          </Pressable>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  editTextContainer: {
    alignItems: "center",
    flexDirection: !I18nManager.isRTL ? "row" : "row-reverse",
    flex: 1,
  },
  iconStyle: {
    [I18nManager.isRTL ? "left" : "right"]: 14,
    position: "absolute",
  },
});

export default ClearableTextInput;
