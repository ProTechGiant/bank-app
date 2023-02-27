import { times } from "lodash";
import { StyleSheet, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import Stack from "../Stack";
import PlusCardActiveSvg from "./plus-card.svg";
import SingleUseCardActiveSvg from "./single-use-card.svg";
import StandardCardActiveSvg from "./standard-card.svg";

interface ActiveBankCardProps {
  cardNumber: string;
  endButton?: React.ReactNode;
  label: string;
  cardType: "standard" | "plus" | "single-use";
}

export default function ActiveBankCard({ cardNumber, endButton, label, cardType }: ActiveBankCardProps) {
  const contentStyles = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing["12p"],
    paddingTop: theme.spacing["12p"],
    paddingBottom: 99,
    ...StyleSheet.absoluteFillObject,
  }));

  const labelStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: "#00000014",
    borderRadius: 4,
    borderWidth: 0,
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: theme.spacing["8p"],
  }));

  const dotStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-50"],
    borderRadius: 2,
    borderWidth: 0,
    height: 4,
    width: 4,
  }));

  return (
    <View style={styles.container}>
      {cardType === "single-use" ? (
        <SingleUseCardActiveSvg />
      ) : cardType === "standard" ? (
        <StandardCardActiveSvg />
      ) : (
        <PlusCardActiveSvg />
      )}
      <View style={[styles.container, contentStyles]}>
        <View style={styles.header}>
          <View style={labelStyle}>
            <Typography.Text color="neutralBase-50" size="caption1" weight="semiBold">
              {label}
            </Typography.Text>
          </View>
          {endButton}
        </View>
        <Stack align="center" direction="horizontal" gap="12p">
          {times(3).map(dotSequenceIndex => (
            <Stack direction="horizontal" key={dotSequenceIndex} gap="4p">
              {times(4).map(currentDotIndex => (
                <View key={currentDotIndex} style={dotStyle} />
              ))}
            </Stack>
          ))}
          <Typography.Text color="neutralBase-50" size="callout">
            {cardNumber}
          </Typography.Text>
        </Stack>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    heigth: 338,
    width: 224,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
