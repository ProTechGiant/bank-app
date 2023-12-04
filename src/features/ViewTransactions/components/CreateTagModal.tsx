import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import { TextInput } from "@/components/Input";
import NotificationModal from "@/components/NotificationModal";
import { useThemeStyles } from "@/theme";
import { palette } from "@/theme/values";

import GiftSvg from "../assets/images/gift.svg";
import { GenericSvgIcon } from "../components";
import { tagIcons } from "../mocks";
import { TagIconType } from "../types";

// Calculate the number of tag icons per row
const iconsPerRow = 3;

const rows: Array<Array<TagIconType>> = [];
for (let i = 0; i < tagIcons.length; i += iconsPerRow) {
  const rowIcons = tagIcons.slice(i, i + iconsPerRow);
  rows.push(rowIcons);
}

interface CreateTagModalProps {
  onCreatePress: (selectedTagId: number, tagName: string) => Promise<boolean | undefined>;
  isNotificationModalVisible: boolean;
  onNotificationModalClose: (isVisible: boolean) => void;
}

export default function CreateTagModal({
  onCreatePress,
  isNotificationModalVisible,
  onNotificationModalClose,
}: CreateTagModalProps) {
  const { t } = useTranslation();

  const [tagName, setTagName] = useState("");
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);

  const modalButtonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["4p"],
    paddingBottom: theme.spacing["20p"],
  }));

  const tagIconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    borderRadius: theme.radii.medium,
    justifyItems: "center",
    alignItems: "center",
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  const createNewTagIconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing["20p"],
  }));

  const modalIconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
    marginVertical: theme.spacing["20p"],
  }));

  const handleOnCreateTagPress = async () => {
    if (!selectedTagId || !tagName) return;
    const isTagCreated = await onCreatePress(selectedTagId, tagName);
    if (isTagCreated) {
      setTagName("");
      setSelectedTagId(null);
    }
  };

  return (
    <>
      <View style={createNewTagIconContainerStyle}>
        <GiftSvg />
      </View>
      <TextInput
        label=""
        variant="small"
        placeholder={t("SelectTagScreen.tagName")}
        value={tagName}
        onChangeText={setTagName}
        testID="ViewTransactions.SelectTagScreen:CreateTagModalTextInput"
      />
      {rows.map((rowIcons, rowIndex) => (
        <View style={modalIconContainerStyle} key={rowIndex}>
          {rowIcons.map(item => (
            <Pressable
              style={[
                tagIconContainerStyle,
                {
                  backgroundColor: item.id === selectedTagId ? palette["neutralBase+20"] : palette["neutralBase+30"],
                },
              ]}
              key={item.id}
              onPress={setSelectedTagId.bind(null, item.id)}
              testID={`ViewTransactions.SelectTagScreen:CreateTagModalSelectTag-${item.name}`}>
              <GenericSvgIcon path={item.path} viewBox={item.viewBox} color={palette["neutralBase-60"]} />
            </Pressable>
          ))}
        </View>
      ))}
      <View style={modalButtonContainerStyle}>
        <Button onPress={handleOnCreateTagPress} testID="ViewTransactions.SelectTagScreen:CreateTagModalConfirmButton">
          {t("SelectTagScreen.createTag")}
        </Button>
      </View>
      <NotificationModal
        title={t("SelectTagScreen.alreadyHaveATagName", { tagName })}
        variant="warning"
        isVisible={isNotificationModalVisible}
        onClose={() => onNotificationModalClose(false)}
        buttons={{
          primary: (
            <Button
              children={t("SelectTagScreen.useExistingTag")}
              onPress={() => onNotificationModalClose(false)}
              testID="ViewTransactions.SelectTagScreen:CreateTagModal-AlreadyHaveTagModalUseExistingButton"
            />
          ),
          secondary: (
            <Button
              children={t("SelectTagScreen.cancel")}
              onPress={() => onNotificationModalClose(false)}
              testID="ViewTransactions.SelectTagScreen:CreateTagModal-AlreadyHaveTagModalCancelButton"
            />
          ),
        }}
        message=""
        testID="ViewTransactions.SelectTagScreen:CreateTagModal-AlreadyHaveTagModal"
      />
    </>
  );
}
