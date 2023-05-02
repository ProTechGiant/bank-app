import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { ArrowForwardIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface TransferErrorBoxProps {
  onPress?: () => void;
  textStart: string;
  textEnd?: string;
}

export default function TransferErrorBox({ onPress, textStart, textEnd }: TransferErrorBoxProps) {
  const errorBoxStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    backgroundColor: theme.palette["errorBase-30"],
    flexDirection: "row",
    columnGap: theme.spacing["16p"],
    marginHorizontal: -theme.spacing["20p"],
    marginBottom: theme.spacing["24p"],
    padding: theme.spacing["20p"],
  }));

  const errorIconColor = useThemeStyles(theme => theme.palette.errorBase);

  return (
    <Pressable onPress={onPress} style={errorBoxStyle}>
      <Typography.Text color="errorBase" size="footnote" weight="regular">
        {textStart}
      </Typography.Text>
      {textEnd !== undefined ? (
        <View style={styles.right}>
          <Typography.Text color="errorBase" size="footnote" weight="medium">
            {textEnd}
          </Typography.Text>
          <ArrowForwardIcon color={errorIconColor} />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  right: {
    alignItems: "center",
    columnGap: 8,
    flexDirection: "row",
  },
});
