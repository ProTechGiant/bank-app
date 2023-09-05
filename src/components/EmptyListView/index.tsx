import React from "react";
import { StyleSheet, useWindowDimensions, ViewStyle } from "react-native";

import { ReferralCarouselIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface EmptyListViewProps {
  header: string;
  message: string;
}

export default function EmptyListView({ header, message }: EmptyListViewProps) {
  const { height: screenHeight } = useWindowDimensions();

  const titleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  const emptyListViewStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    marginBottom: theme.spacing["16p"],
    alignSelf: "center",
    borderRadius: theme.radii.xlarge,
  }));

  return (
    <Stack direction="vertical" align="center" justify="center" style={{ height: screenHeight * 0.5 }}>
      <Stack direction="vertical" style={emptyListViewStyle}>
        <ReferralCarouselIcon />
      </Stack>
      <Typography.Text style={titleStyle} weight="bold" size="title3" align="center">
        {header}
      </Typography.Text>
      <Typography.Text style={styles.paddingBottom} size="callout" color="neutralBase+10" align="center">
        {message}
      </Typography.Text>
    </Stack>
  );
}

const styles = StyleSheet.create({
  paddingBottom: {
    paddingBottom: 100,
  },
});
