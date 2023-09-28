import { useState } from "react";
import { Animated, I18nManager, Image, Pressable, StyleSheet, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import whiteTriangleHorizontal from "@/assets/rectangle-image-divider.png";
import NetworkImage from "@/components/NetworkImage";
import { useThemeStyles } from "@/theme";

import { BackGoalDetailIcon, ChangeImageIcon, EditGoalIcon } from "../assets/icons";
import TagsProduct from "./TagsProduct";
import TagsRisk from "./TagsRisk";

interface CollapsibleHeaderProps {
  backgroundImage: string;
  onBackPress: () => void;
  onEditImagePress: () => void;
  scrollHeight: Animated.AnimatedInterpolation<string | number>;
  opacityGoalTag: Animated.AnimatedInterpolation<string | number>;
  onGalleryImageChoosePress: () => void;
  onGoalEdit: () => void;
  product: string;
  productColor: string;
  productRisk: string;
  productRiskColor: string;
}

export default function CollapsibleHeader({
  backgroundImage,
  onBackPress,
  onEditImagePress,
  scrollHeight,
  opacityGoalTag,
  onGoalEdit,
  product,
  productColor,
  productRisk,
  productRiskColor,
}: CollapsibleHeaderProps) {
  const insets = useSafeAreaInsets();
  const [containerWidth, setContainerWidth] = useState(100);

  const goalTagContainerStyles = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    bottom: theme.spacing["32p"],
    start: theme.spacing["16p"],
    gap: theme.spacing["8p"],
    flexDirection: "row",
  }));

  const backButtonStyle = useThemeStyles<ViewStyle>(
    theme => ({
      position: "absolute",
      top: theme.spacing["16p"] + insets.top,
      start: theme.spacing["16p"],
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    }),
    [insets.top]
  );

  const editButtonStyle = useThemeStyles<ViewStyle>(
    theme => ({
      position: "absolute",
      top: theme.spacing["16p"] + insets.top,
      end: theme.spacing["16p"],
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    }),
    [insets.top]
  );

  const chooseImageStyle = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    bottom: theme.spacing["32p"],
    end: theme.spacing["16p"],
  }));

  return (
    <Animated.View style={[styles.animatedHeader, { height: scrollHeight }]}>
      <NetworkImage
        source={{ uri: backgroundImage }}
        style={styles.imageStyle}
        onLayout={event => {
          const { width } = event.nativeEvent.layout;
          setContainerWidth(width);
        }}
      />
      <Image
        source={whiteTriangleHorizontal}
        style={[styles.imageBackGround, { width: containerWidth }]}
        resizeMode="stretch"
      />
      <Animated.View style={[goalTagContainerStyles, { opacity: opacityGoalTag }]}>
        <TagsProduct productName={product} productColor={productColor} />
        <TagsRisk productRisk={productRisk} productRiskColor={productRiskColor} />
      </Animated.View>
      <Pressable style={backButtonStyle} onPress={onBackPress}>
        <BackGoalDetailIcon />
      </Pressable>
      <Pressable style={editButtonStyle} onPress={onGoalEdit}>
        <EditGoalIcon />
      </Pressable>
      <Pressable style={chooseImageStyle} onPress={onEditImagePress}>
        <Animated.View style={{ opacity: opacityGoalTag }}>
          <ChangeImageIcon />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedHeader: {
    left: 0,
    overflow: "hidden",
    position: "absolute",
    right: 0,
    top: 0,
    width: "100%",
    zIndex: 999,
  },
  imageBackGround: {
    bottom: 0,
    position: "absolute",
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
  imageStyle: {
    flex: 1,
  },
});
