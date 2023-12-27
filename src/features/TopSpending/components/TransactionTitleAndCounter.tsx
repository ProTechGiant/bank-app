import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { FilterListIcon } from "../assets/icons";

interface TransactionTitleAndCounterProps {
  handleOnOpenModal: () => void;
  counter: number;
}

export default function TransactionTitleAndCounter({ handleOnOpenModal, counter }: TransactionTitleAndCounterProps) {
  const { t } = useTranslation();

  const counterStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    marginStart: theme.spacing["4p"],
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radii.xxlarge,
    backgroundColor: theme.palette["neutralBase+30"],
    width: 16,
    height: 16,
  }));

  return (
    <View style={styles.headers}>
      <Typography.Text color="neutralBase+30" weight="semiBold" size="title3">
        {t("TopSpending.SingleTagScreen.TransactionList.transactions")}
      </Typography.Text>

      <View style={styles.icon}>
        <Pressable onPress={handleOnOpenModal}>
          <FilterListIcon />
        </Pressable>
        {counter ? (
          <View style={counterStyle}>
            <Typography.Text size="caption2" weight="medium" color="neutralBase-60">
              {counter}
            </Typography.Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headers: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  icon: {
    alignItems: "center",
    flexDirection: "row",
  },
});
