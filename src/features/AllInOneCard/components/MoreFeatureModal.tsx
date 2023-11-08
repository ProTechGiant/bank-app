import { useTranslation } from "react-i18next";
import { FlatList, ImageStyle, Platform, StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Modal, Typography } from "@/components";
import Button from "@/components/Button";
import NetworkImage from "@/components/NetworkImage";
import { useThemeStyles } from "@/theme";

import { Benefit, CardData } from "../types";
import HeaderModal from "./HeaderModal";

interface MoreFeatureModalProps {
  isVisible: boolean;
  onClose: () => void;
  item: CardData;
  onPress: () => void;
}

export default function MoreFeatureModal({ isVisible, onClose, item, onPress }: MoreFeatureModalProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

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

  const imageStyle = useThemeStyles<ImageStyle>(theme => ({
    width: theme.spacing["24p"],
    height: theme.spacing["24p"],
  }));

  const renderItem = ({ item }: { item: Benefit }) => (
    <View style={itemContainerStyle}>
      <NetworkImage
        source={{
          uri: "https://media.istockphoto.com/id/481365786/photo/diamond.jpg?s=612x612&w=0&k=20&c=niuZ5_KvgJrK08y-bjpXEsninUBf83ha-44_yrPmqpk=",
        }}
        style={imageStyle}
      />
      <View style={styles.flex}>
        <Typography.Text weight="medium" size="callout" color="neutralBase+30">
          {item.title}
        </Typography.Text>
        <Typography.Text size="footnote" color="neutralBase">
          {item.subTitle}
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
          <FlatList data={item.benefits} renderItem={renderItem} keyExtractor={(item, index) => index.toString()} />
          <Button onPress={onPress}>{t("AllInOneCard.SelectedCardScreen.applyButton")}</Button>
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
