import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import { WithShadow } from "@/components";
import Button from "@/components/Button";
import { TextInput } from "@/components/Input";
import NotificationModal from "@/components/NotificationModal";
import { useThemeStyles } from "@/theme";
import { palette } from "@/theme/values";

import GiftSvg from "../assets/gift.svg";
import { GenericSvgIcon } from "../components";
import { tagIcons } from "../mocks/MockData";
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
    borderRadius: 30000,
    justifyItems: "center",
    alignItems: "center",
    backgroundColor: theme.palette["neutralBase-40"],
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

  const circleStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    borderColor: theme.palette["neutralBase-60"],
    borderRadius: 50,
    borderWidth: 4,
    height: 104,
    justifyContent: "center",
    width: 104,
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
        <WithShadow backgroundColor="transparent" borderRadius="xxlarge">
          <View style={circleStyle}>
            <GiftSvg />
          </View>
        </WithShadow>
      </View>
      <TextInput
        label=""
        variant="small"
        placeholder={t("SelectTagScreen.tagName")}
        value={tagName}
        onChangeText={setTagName}
      />
      {rows.map((rowIcons, rowIndex) => (
        <View style={modalIconContainerStyle} key={rowIndex}>
          {rowIcons.map(item => (
            <Pressable
              style={[
                tagIconContainerStyle,
                {
                  backgroundColor: item.id === selectedTagId ? palette.primaryBase : palette["neutralBase-40"],
                },
              ]}
              key={item.id}
              onPress={setSelectedTagId.bind(null, item.id)}>
              <GenericSvgIcon
                path={item.path}
                viewBox={item.viewBox}
                color={item.id === selectedTagId ? palette["neutralBase-60"] : undefined}
              />
            </Pressable>
          ))}
        </View>
      ))}
      <View style={modalButtonContainerStyle}>
        <Button onPress={handleOnCreateTagPress}>{t("SelectTagScreen.createTag")}</Button>
      </View>
      <NotificationModal
        title={t("SelectTagScreen.alreadyHaveATagName", { tagName })}
        variant="warning"
        isVisible={isNotificationModalVisible}
        onClose={() => onNotificationModalClose(false)}
        buttons={{
          primary: (
            <Button children={t("SelectTagScreen.useExistingTag")} onPress={() => onNotificationModalClose(false)} />
          ),
          secondary: <Button children={t("SelectTagScreen.cancel")} onPress={() => onNotificationModalClose(false)} />,
        }}
        message=""
      />
    </>
  );
}
