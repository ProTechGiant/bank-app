import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, ImageStyle, Pressable, View, ViewStyle } from "react-native";

import { Modal, Stack, Typography } from "@/components";
import Accordion from "@/components/Accordion";
import Button from "@/components/Button";
import Radio from "@/components/Radio";
import { useThemeStyles } from "@/theme";

import { Currencies } from "../../mocks";
import { Account, CurrenciesType } from "../../types";

interface SelectDestinationModalProps {
  isDestinationModalVisible: boolean;
  onClose: () => void;
  onSelectDestination: (item: Account | CurrenciesType) => void;
  destinationAccounts: Account[];
}

export default function SelectDestinationModal({
  isDestinationModalVisible,
  onClose,
  onSelectDestination,
  destinationAccounts,
}: SelectDestinationModalProps) {
  const { t } = useTranslation();
  const [selectedDestination, setSelectedDestination] = useState<Account | CurrenciesType>(destinationAccounts[0]);

  const changeDestination = (item: Account | CurrenciesType) => {
    setSelectedDestination(item);
  };
  const handleSelectDestination = () => {
    onSelectDestination(selectedDestination);
    onClose();
  };

  const modalItemStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
  }));

  const buttonStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
  }));

  const currencyStyle = useThemeStyles<ImageStyle>(theme => ({
    width: theme.spacing["24p"],
    height: theme.spacing["24p"],
  }));

  return (
    <Modal
      testID="AllInOneCard.AddMoneyScreen:DestinationModal"
      onClose={onClose}
      headerText={t("AllInOneCard.AddMoneyScreen.destinationModal.title")}
      visible={isDestinationModalVisible}>
      <Stack direction="vertical" gap="16p" align="stretch">
        <Stack direction="vertical" gap="16p" align="stretch">
          {destinationAccounts.map((item, index) => {
            return (
              <Pressable
                onPress={() => changeDestination(item)}
                key={index}
                testID={`AllInOneCard.AddMoneyScreen.destinationModal :${item.Name} Pressable`}>
                <Stack direction="horizontal" style={modalItemStyle} align="stretch" justify="space-between" gap="16p">
                  <Stack direction="horizontal" gap="16p" align="center">
                    <Image source={item.Logo} />
                    <Stack direction="vertical" gap="4p">
                      <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                        {item.Name}
                      </Typography.Text>
                      <Typography.Text color="neutralBase" size="footnote">
                        {t("AllInOneCard.AddMoneyScreen.dots")} {item.AccountNumber.slice(-4)}
                      </Typography.Text>
                    </Stack>
                  </Stack>
                  <Radio
                    testID={`AllInOneCard.AddMoneyScreen.destinationModal : ${item.Name} Radio`}
                    isSelected={selectedDestination?.ID === item?.ID}
                    onPress={() => setSelectedDestination(item)}
                  />
                </Stack>
              </Pressable>
            );
          })}
        </Stack>
        <View>
          <Accordion
            title={t("AllInOneCard.AddMoneyScreen.destinationModal.otherCurrency")}
            backgroundColor="neutralBase-60"
            showIcon={false}>
            <Stack direction="vertical" align="stretch">
              {Currencies.map((item, index) => (
                <Pressable
                  testID={`AllInOneCard.AddMoneyScreen.destinationModal.otherCurrency:${item.CurrencyCode} Pressable`}
                  onPress={() => setSelectedDestination(item)}
                  key={index}>
                  <Stack direction="horizontal" style={modalItemStyle} align="stretch" justify="space-between">
                    <Stack direction="horizontal" gap="16p">
                      <Image source={item.CurrencyLogo} style={currencyStyle} />
                      <Stack direction="vertical" gap="4p">
                        <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                          {item.CurrencyCode}
                        </Typography.Text>
                        <Typography.Text color="neutralBase" size="footnote">
                          {item.CurrencyName}
                        </Typography.Text>
                      </Stack>
                    </Stack>
                    <Radio
                      testID={`AllInOneCard.AddMoneyScreen.destinationModal : ${item.CurrencyName} Radio`}
                      isSelected={selectedDestination?.CurrencyID === item?.CurrencyID}
                      onPress={() => setSelectedDestination(item)}
                    />
                  </Stack>
                </Pressable>
              ))}
            </Stack>
          </Accordion>
        </View>
      </Stack>
      <View style={buttonStyle}>
        <Button testID="AllInOneCard.AddMoneyScreen:confirmButton" onPress={handleSelectDestination}>
          {t("AllInOneCard.AddMoneyScreen.destinationModal.selectButton")}
        </Button>
      </View>
    </Modal>
  );
}
