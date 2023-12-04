import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { ArrowForwardIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import Button from "../Button";
import Stack from "../Stack";

interface TransferErrorBoxProps {
  onPress?: () => void;
  textStart: string;
  textEnd?: string;
  testID?: string;
  hasButton?: boolean;
}

export default function TransferErrorBox({ onPress, textStart, textEnd, testID, hasButton }: TransferErrorBoxProps) {
  const errorBoxStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    backgroundColor: theme.palette["errorBase-30"],
    flexDirection: "row",
    columnGap: theme.spacing["16p"],
    marginHorizontal: -theme.spacing["20p"],
    marginBottom: theme.spacing["24p"],
    padding: theme.spacing["20p"],
    borderRadius: theme.spacing["8p"],
  }));

  const errorIconColor = useThemeStyles(theme => theme.palette.errorBase);

  return (
    <Pressable onPress={onPress} style={errorBoxStyle} testID={testID}>
      <Stack direction="horizontal" justify="space-between" gap="64p" align="center">
        <Typography.Text style={styles.textStyle} color="errorBase" size="footnote" weight="regular">
          {textStart}
        </Typography.Text>
        {textEnd !== undefined ? (
          hasButton ? (
            <View style={styles.right}>
              <Button size="small" color="dark" onPress={onPress}>
                {textEnd}
              </Button>
            </View>
          ) : (
            <View style={styles.right}>
              <Typography.Text color="errorBase" size="footnote" weight="medium">
                {textEnd}
              </Typography.Text>
              <ArrowForwardIcon color={errorIconColor} isRtl={I18nManager.isRTL} />
            </View>
          )
        ) : null}
      </Stack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  right: {
    alignItems: "center",
    alignSelf: "flex-end",
    flexDirection: "row",
  },
  textStyle: {
    width: "45%",
  },
});
