import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, View, ViewStyle } from "react-native";

import { Modal, Stack, Typography } from "@/components";
import Accordion from "@/components/Accordion";
import Button from "@/components/Button";
import FullScreenLoader from "@/components/FullScreenLoader";
import Radio from "@/components/Radio";
import SvgIcon from "@/components/SvgIcon/SvgIcon";
import { useAuthContext } from "@/contexts/AuthContext";
import { useThemeStyles } from "@/theme";

import { useGetCustomerCurrencies } from "../../hooks/query-hooks";
import { Account } from "../../types";
interface AccountPickerModalProps {
  modalTitle: string;
  isVisible: boolean;
  onClose: () => void;
  onSelectAccount: (item: Account) => void;
  accounts: Account[];
  isForeignCurrencyVisible: boolean;
}

export default function AccountPickerModal({
  modalTitle,
  isVisible,
  onClose,
  onSelectAccount,
  accounts,
  isForeignCurrencyVisible,
}: AccountPickerModalProps) {
  const { t } = useTranslation();
  const {
    otherAioCardProperties: { aioCardId },
  } = useAuthContext();
  const [selectedDestination, setSelectedDestination] = useState<Account>(accounts[0]);

  const changeDestination = (item: Account) => {
    setSelectedDestination(item);
  };
  const handleSelectDestination = () => {
    onSelectAccount(selectedDestination);
    onClose();
  };

  const { data: customerCurrencies, isLoading } = useGetCustomerCurrencies(aioCardId ?? "");
  const CurrenciesData = customerCurrencies?.CurrenciesList?.filter(c => c.CurrencyCode !== "SAR");

  const Currencies = CurrenciesData?.map(currency => ({
    ID: currency.CurrencyID,
    Logo: currency.CurrencyLogo,
    Name: currency.CurrencyName,
    Balance: currency.CurrencyBalance,
    CurrencyCode: currency.CurrencyCode,
  }));

  const modalItemStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
  }));

  const buttonStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
  }));

  const loaderStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["20p"],
  }));

  return (
    <Modal
      testID="AllInOneCard.TopUpAndRefundScreen:Modal"
      onClose={onClose}
      headerText={modalTitle}
      visible={isVisible}>
      <Stack direction="vertical" gap="16p" align="stretch">
        <Stack direction="vertical" gap="16p" align="stretch">
          {accounts.map((item: Account, index: number) => {
            return (
              <Pressable
                onPress={() => changeDestination(item)}
                key={index}
                testID={`AllInOneCard.TopUpAndRefundScreen.Modal :${item.Name} Pressable`}>
                <Stack direction="horizontal" style={modalItemStyle} align="stretch" justify="space-between" gap="16p">
                  <Stack direction="horizontal" gap="16p" align="center">
                    <Image source={item.Logo} />
                    <Stack direction="vertical" gap="4p">
                      <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                        {item.Name}
                      </Typography.Text>
                      <Typography.Text color="neutralBase" size="footnote">
                        {t("AllInOneCard.TopUpAndRefundScreen.dots")}{" "}
                        {item.AccountNumber ? item.AccountNumber.slice(-4) : null}
                      </Typography.Text>
                    </Stack>
                  </Stack>
                  <Radio
                    testID={`AllInOneCard.TopUpAndRefundScreen.nModal : ${item.Name} Radio`}
                    isSelected={selectedDestination?.ID === item?.ID}
                    onPress={() => setSelectedDestination(item)}
                  />
                </Stack>
              </Pressable>
            );
          })}
        </Stack>

        <View>
          {isForeignCurrencyVisible ? (
            <Accordion
              title={t("AllInOneCard.TopUpAndRefundScreen.otherCurrency")}
              backgroundColor="neutralBase-60"
              showIcon={false}>
              {!isLoading && Currencies ? (
                <Stack direction="vertical" align="stretch">
                  {Currencies.map((currency, index) => (
                    <Pressable
                      testID={`AllInOneCard.TopUpAndRefundScreen.Modal.otherCurrency:${currency.CurrencyCode} Pressable`}
                      onPress={() => setSelectedDestination(currency)}
                      key={index}>
                      <Stack direction="horizontal" style={modalItemStyle} align="stretch" justify="space-between">
                        <Stack direction="horizontal" gap="16p">
                          <SvgIcon uri={currency.Logo} width={24} height={24} />
                          <Stack direction="vertical" gap="4p">
                            <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                              {currency.CurrencyCode}
                            </Typography.Text>
                            <Typography.Text color="neutralBase" size="footnote">
                              {currency.Name}
                            </Typography.Text>
                          </Stack>
                        </Stack>
                        <Radio
                          testID={`AllInOneCard.TopUpAndRefundScreen.destinationModal : ${currency.Name} Radio`}
                          isSelected={selectedDestination.ID === currency.ID}
                          onPress={() => setSelectedDestination(currency)}
                        />
                      </Stack>
                    </Pressable>
                  ))}
                </Stack>
              ) : (
                <View style={loaderStyle}>
                  <FullScreenLoader />
                </View>
              )}
            </Accordion>
          ) : (
            <></>
          )}
        </View>
      </Stack>
      <View style={buttonStyle}>
        <Button testID="AllInOneCard.TopUpAndRefundScreen:confirmButton" onPress={handleSelectDestination}>
          {t("AllInOneCard.TopUpAndRefundScreen.selectButton")}
        </Button>
      </View>
    </Modal>
  );
}
