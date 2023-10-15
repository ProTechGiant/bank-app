import { useTranslation } from "react-i18next";
import { FlatList, Platform, StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Modal, Typography } from "@/components";
import Button from "@/components/Button";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { neraDataModal } from "../mocks";
import { CardData, neraData } from "../types";
import HeaderModal from "./HeaderModal";

interface MoreFeatureModalProps {
  isVisible: boolean;
  onClose: () => void;
  item: CardData;
}

export default function MoreFeatureModal({ isVisible, onClose, item }: MoreFeatureModalProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const onApplyPress = () => {
    navigation.navigate("AllInOneCard.ChooseRedemptionMethod");
  };

  const containerViewStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    paddingHorizontal: theme.spacing["20p"],
    justifyContent: "space-between",
    marginTop: theme.spacing["32p"],
    gap: theme.spacing["16p"],
  }));
  const itemContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "flex-start",
    paddingVertical: theme.spacing["12p"],
    gap: theme.spacing["16p"],
    flexDirection: "row",
  }));

  const renderItem = ({ item }: { item: neraData }) => (
    <View style={itemContainerStyle}>
      {item.icon}
      <View style={styles.flex}>
        <Typography.Text weight="medium" size="callout" color="neutralBase+30">
          {item.title}
        </Typography.Text>
        <Typography.Text size="footnote" color="neutralBase">
          {item.description}
        </Typography.Text>
      </View>
    </View>
  );

  return (
    <Modal
      visible={isVisible}
      closeHasBackground={true}
      padding={0}
      style={[styles.container, Platform.OS === "ios" && { paddingTop: insets.top }]}>
      <View style={styles.viewContainer}>
        <HeaderModal onClose={onClose} item={item} />
        <View style={containerViewStyle}>
          <FlatList data={neraDataModal} renderItem={renderItem} keyExtractor={(item, index) => index.toString()} />
          <Button onPress={onApplyPress}>
            {item.id === 1
              ? t("AllInOneCard.SelectedCardScreen.platinumButton")
              : t("AllInOneCard.SelectedCardScreen.signatureButton")}
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  flex: {
    flex: 1,
  },
  viewContainer: {
    height: "100%",
    justifyContent: "space-between",
  },
});
