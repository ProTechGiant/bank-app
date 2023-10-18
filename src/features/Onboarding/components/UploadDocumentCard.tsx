import React from "react";
import { Pressable, StyleSheet, TextStyle, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

import { UploadIcon } from "../assets/UploadIcon";
import { UploadDocumentStatus } from "../constants";
import UploadDocumentStatusView from "./UploadDocumentStatusView";

interface UploadDocumentCardProps {
  title: string;
  description: string;
  status: UploadDocumentStatus;
}

export default function UploadDocumentCard({ description, status, title }: UploadDocumentCardProps) {
  const renderItemStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["20p"],
    paddingHorizontal: theme.spacing["16p"],
    marginVertical: theme.spacing["8p"],
    borderWidth: 1,
    borderRadius: theme.radii.small,
    borderColor: theme.palette["neutralBase-30"],
  }));

  const renderItemDateStyle = useThemeStyles<TextStyle>(theme => ({
    marginBottom: theme.spacing["4p"],
  }));

  const leftSideContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    columnGap: theme.spacing["16p"],
  }));

  return (
    <Stack as={Pressable} align="stretch" direction="vertical">
      <Stack direction="horizontal" style={renderItemStyle} align="center" justify="space-between">
        <Stack style={leftSideContainerStyle} direction="vertical">
          <UploadDocumentStatusView status={status} />
          <Typography.Text style={renderItemDateStyle} color="neutralBase+30" size="callout" weight="medium">
            {title}
          </Typography.Text>
          <Typography.Text style={styles.decription} color="primaryBase" size="footnote">
            {description}
          </Typography.Text>
        </Stack>
        <UploadIcon />
      </Stack>
    </Stack>
  );
}

const styles = StyleSheet.create({
  decription: {
    textDecorationLine: "underline",
  },
});
