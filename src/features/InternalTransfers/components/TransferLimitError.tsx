import { StyleSheet, View, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface TransferLimitErrorProps {
  textStart: string;
  textEnd?: string;
}

export default function TransferLimitError({ textStart, textEnd }: TransferLimitErrorProps) {
  const errorBoxStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    backgroundColor: theme.palette["errorBase-30"],
    flexDirection: "row",
    columnGap: theme.spacing["16p"],
    marginHorizontal: -theme.spacing["20p"],
    marginBottom: theme.spacing["24p"],
    padding: theme.spacing["16p"],
  }));

  const rightWhiteButton = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    paddingVertical: theme.spacing["8p"],
    borderRadius: theme.spacing["24p"],
    backgroundColor: theme.palette["neutralBase-60"],
    alignItems: "center",
    columnGap: theme.spacing["8p"],
    flexDirection: "row",
  }));

  return (
    <Stack direction="horizontal" style={errorBoxStyle}>
      <Typography.Text color="errorBase" size="footnote" weight="regular" style={styles.messageWidth}>
        {textStart}
      </Typography.Text>
      {textEnd !== undefined ? (
        <View style={rightWhiteButton}>
          <Typography.Text color="primaryBase-10" size="footnote" weight="medium">
            {textEnd}
          </Typography.Text>
        </View>
      ) : null}
    </Stack>
  );
}

const styles = StyleSheet.create({
  messageWidth: { width: "50%" },
});
