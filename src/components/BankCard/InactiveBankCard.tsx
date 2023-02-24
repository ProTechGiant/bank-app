import { StyleSheet, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { ActionButtonProps } from "./ActionButton";
import CardInactiveSvg from "./card-inactive.svg";

interface InactiveBankCardProps {
  actionButton: React.ReactElement<ActionButtonProps>;
  endButton?: React.ReactNode;
  label: string;
}

export default function InactiveBankCard({ actionButton, endButton, label }: InactiveBankCardProps) {
  const contentStyles = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing["12p"],
    paddingTop: theme.spacing["12p"],
    paddingBottom: theme.spacing["48p"],
    ...StyleSheet.absoluteFillObject,
  }));

  const labelStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: "#00000014",
    borderRadius: 4,
    borderWidth: 0,
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: theme.spacing["8p"],
  }));

  return (
    <View style={styles.container}>
      <CardInactiveSvg />
      <View style={[styles.container, contentStyles]}>
        <View style={styles.header}>
          <View style={labelStyle}>
            <Typography.Text color="neutralBase-50" size="caption1" weight="semiBold">
              {label}
            </Typography.Text>
          </View>
          {endButton}
        </View>
        <View>{actionButton}</View>
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
