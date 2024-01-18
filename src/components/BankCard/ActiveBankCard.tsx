import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { CroatiaLogoIcon, FreezeIcon, ShowCardIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import {
  LUX_CARD_PRODUCT_ID,
  PHYSICAL_CARD_TYPE,
  SINGLE_USE_CARD_TYPE,
  STANDARD_CARD_PRODUCT_ID,
  VIRTUAL_CARD_TYPE,
} from "@/constants";
import { useThemeStyles } from "@/theme";

import { ActionButtonProps } from "./ActionButton";
import PlusCardActiveSvg from "./plus-card.svg";
import SingleUseCardActiveSvg from "./single-use-card.svg";
import StandardCardActiveSvg from "./standard-card.svg";

interface ActiveBankCardProps {
  cardType: typeof PHYSICAL_CARD_TYPE | typeof SINGLE_USE_CARD_TYPE | typeof VIRTUAL_CARD_TYPE;
  onPress?: () => void;
  productId: typeof STANDARD_CARD_PRODUCT_ID | typeof LUX_CARD_PRODUCT_ID;
  actionButton?: React.ReactElement<ActionButtonProps>;
  testID?: string;
  isExpireSoon: boolean;
  onShowDetailsPress?: () => void;
  onFreezePress?: () => void;
}

export default function ActiveBankCard({
  cardType,
  productId,
  onPress,
  actionButton,
  testID,
  isExpireSoon,
  onShowDetailsPress,
  onFreezePress,
}: ActiveBankCardProps) {
  const contentStyles = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["48p"],
    paddingVertical: theme.spacing["24p"],
    ...StyleSheet.absoluteFillObject,
  }));

  const iconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: 50,
    backgroundColor: theme.palette["neutralBase-60-60%"],
    padding: theme.spacing["8p"],
  }));

  return (
    <View style={styles.container} testID={testID}>
      {cardType === SINGLE_USE_CARD_TYPE ? (
        <SingleUseCardActiveSvg />
      ) : productId === STANDARD_CARD_PRODUCT_ID ? (
        <StandardCardActiveSvg />
      ) : (
        <PlusCardActiveSvg />
      )}

      {isExpireSoon ? (
        <View style={[styles.container, contentStyles]}>
          <Stack direction="horizontal" gap="8p" justify="flex-end">
            <Pressable onPress={onFreezePress}>
              <View style={iconContainerStyle}>
                <FreezeIcon />
              </View>
            </Pressable>
            <Pressable onPress={onShowDetailsPress}>
              <View style={iconContainerStyle}>
                <ShowCardIcon />
              </View>
            </Pressable>
          </Stack>
        </View>
      ) : null}
      <View style={styles.actionContainer}>{actionButton !== undefined ? actionButton : <CroatiaLogoIcon />}</View>
      {/* Pressable area for redirecting to card details page */}
      {onPress !== undefined ? (
        <>
          <Pressable onPress={onPress} style={styles.pressableAreaTop} />
          <Pressable onPress={onPress} style={styles.pressableAreaBottom} />
        </>
      ) : null}
    </View>
  );
}

const CONTAINER_HEIGHT = 205;
const CONTAINER_WIDTH = 326;

const TOP_END_BUTTON_WIDTH = 60;
const PRESSABLE_TOP_AREA = 60;

const styles = StyleSheet.create({
  actionContainer: {
    alignItems: "center",
    bottom: PRESSABLE_TOP_AREA,
    flexDirection: "row",
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: PRESSABLE_TOP_AREA,
  },
  container: {
    height: CONTAINER_HEIGHT,
    width: CONTAINER_WIDTH,
  },
  pressableAreaBottom: {
    height: CONTAINER_HEIGHT - PRESSABLE_TOP_AREA,
    left: 0,
    position: "absolute",
    top: PRESSABLE_TOP_AREA,
    width: CONTAINER_WIDTH,
  },
  pressableAreaTop: {
    height: PRESSABLE_TOP_AREA,
    left: I18nManager.isRTL ? undefined : 0,
    position: "absolute",
    right: I18nManager.isRTL ? 0 : undefined,
    top: 0,
    width: CONTAINER_WIDTH - TOP_END_BUTTON_WIDTH,
  },
});
