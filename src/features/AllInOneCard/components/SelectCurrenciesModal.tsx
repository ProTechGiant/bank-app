import { useTranslation } from "react-i18next";
import { Image, ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

import { Modal, Stack } from "@/components";
import Button from "@/components/Button";
import { useThemeStyles } from "@/theme";

import { CurrenciesType } from "../types";

interface SelectCurrenciesModalProps {
  modalIsVisible: boolean;
  setModalIsVisible: (value: boolean) => void;
  myCurrencies: CurrenciesType[];
}

export default function SelectCurrenciesModal({
  modalIsVisible,
  setModalIsVisible,
  myCurrencies,
}: SelectCurrenciesModalProps) {
  const { t } = useTranslation();

  const textStyle = useThemeStyles<TextStyle>(theme => ({
    fontSize: theme.typography.text.sizes.callout,
    fontWeight: theme.typography.text.weights.medium,
    color: "#1E1A25",
  }));
  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
  }));

  return (
    <Modal
      visible={modalIsVisible}
      onClose={() => setModalIsVisible(false)}
      headerText={t("AllInOneCard.myCurrenciesScreens.selectedCurrency")}
      testID="AllInOneCard.PaymentCurrenciesScreen:Modal">
      <ScrollView>
        <Stack direction="vertical" gap="8p">
          {myCurrencies.map((item, index) => (
            <Stack direction="horizontal" gap="16p" align="center" key={index}>
              <Image source={item.CurrencyLogo} style={styles.imageWidth} />
              <Stack direction="vertical">
                <Text style={textStyle}>{item.CurrencyCode}</Text>
                <Text style={styles.textColor}>{item.CurrencyName}</Text>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </ScrollView>
      <View style={buttonContainerStyle}>
        <Button
          onPress={() => {
            setModalIsVisible(false);
          }}>
          OK
        </Button>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  imageWidth: {
    height: 25,
    width: 25,
  },
  textColor: {
    color: "#78758A",
  },
});
