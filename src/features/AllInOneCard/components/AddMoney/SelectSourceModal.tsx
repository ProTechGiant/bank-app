import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, View, ViewStyle } from "react-native";

import { Modal, Stack, Typography } from "@/components";
import Button from "@/components/Button";
import Radio from "@/components/Radio";
import { useThemeStyles } from "@/theme";

import { sourceAccounts } from "../../mocks";
import { Account } from "../../types";
interface SelectSourceModalProps {
  isSourceModalVisible: boolean;
  onClose: () => void;
  Sources: Account[];
  onSelectSource: (item: Account) => void;
}

export default function SelectSourceModal({
  isSourceModalVisible,
  onClose,
  onSelectSource,
  Sources,
}: SelectSourceModalProps) {
  const { t } = useTranslation();
  const [selectedSource, setSelectedSource] = useState<Account>(sourceAccounts[0]);
  const handleSelectSource = () => {
    onSelectSource(selectedSource);
    onClose();
  };

  const modalItemStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
  }));

  const buttonStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
  }));

  return (
    <Modal
      testID="AllInOneCard.AddMoneyScreen:SourceModal"
      onClose={onClose}
      headerText={t("AllInOneCard.AddMoneyScreen.sourceModal.title")}
      visible={isSourceModalVisible}>
      <Stack direction="vertical" gap="16p" align="stretch">
        {Sources.map((item, index) => {
          return (
            <Pressable
              onPress={() => setSelectedSource(item)}
              key={index}
              testID={`AllInOneCard.AddMoneyScreen: ${item.Name} Pressable`}>
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
                  testID={`AllInOneCard.AddMoneyScreen.sourceModal:${item.Name} Radio`}
                  isSelected={selectedSource.ID === item.ID}
                  onPress={() => setSelectedSource(item)}
                />
              </Stack>
            </Pressable>
          );
        })}
      </Stack>
      <View style={buttonStyle}>
        <Button testID="AllInOneCard.AddMoneyScreen.sourceModal:selectButton" onPress={handleSelectSource}>
          {t("AllInOneCard.AddMoneyScreen.sourceModal.selectButton")}
        </Button>
      </View>
    </Modal>
  );
}
