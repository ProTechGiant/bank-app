import { useRef } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { AssetSection, HeaderContent, MutualFundDashboardHeaderContent, SliderProgressBar } from "../components";

export default function MutualFundDetailsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const scrollOffsetY = useRef(new Animated.Value(0)).current;

  const H_MIN_HEIGHT = 52 + insets.top + 8;
  const H_MAX_HEIGHT = 260 + insets.top;
  const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT;

  const headerScrollHeight = scrollOffsetY.interpolate({
    inputRange: [2, H_SCROLL_DISTANCE],
    outputRange: [H_MAX_HEIGHT, H_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: H_MAX_HEIGHT + theme.spacing["16p"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["16p"],
    marginHorizontal: theme.spacing["20p"],
  }));

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["12p"],
    marginVertical: -theme.spacing["32p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <Animated.View style={[styles.animatedHeader, { height: headerScrollHeight }]}>
        <HeaderContent headerTitle="Mutual Fund Details" showInfoIndicator={true}>
          <Stack direction="vertical">
            <Typography.Text color="neutralBase-60">TODO: this content just for test</Typography.Text>
            <MutualFundDashboardHeaderContent />
          </Stack>
        </HeaderContent>
      </Animated.View>
      <Animated.ScrollView
        style={containerStyle}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}>
        <View style={contentContainerStyle}>
          <SliderProgressBar />
          <AssetSection />
          <View style={buttonContainerStyle}>
            <Button
              onPress={() => {
                navigation.navigate("MutualFund.Subscription");
              }}>
              {/* TODO: will be replaced from translation */}
              Go to Subscription Screen
            </Button>
          </View>
        </View>
      </Animated.ScrollView>
    </Page>
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
});
