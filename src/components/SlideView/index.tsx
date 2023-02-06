import times from "lodash/times";
import { useRef, useState } from "react";
import { Animated, NativeScrollEvent, StyleSheet, View, ViewStyle } from "react-native";
import PagerView, { PagerViewOnPageSelectedEvent } from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import { CloseEndButtonProps } from "@/components/NavHeader/CloseEndButton";
import { TextEndButtonProps } from "@/components/NavHeader/TextEndButton";
import { useThemeStyles } from "@/theme";

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

interface SlideViewProps {
  children: JSX.Element[];
  onFinishPress: () => void;
  onBackPress?: () => void;
  buttonText: string;
  lastButtonText: string;
  end?: "close" | React.ReactElement<CloseEndButtonProps> | React.ReactElement<TextEndButtonProps> | false;
}

export default function SlideView({
  children,
  onFinishPress,
  onBackPress,
  buttonText,
  lastButtonText,
  end,
}: SlideViewProps) {
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["primaryBase"],
      paddingHorizontal: theme.spacing["16p"],
      flex: 1,
    }),
    []
  );
  const activeDotStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["neutralBase-50"],
    }),
    []
  );
  const inactiveDotStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["tintBase"],
    }),
    []
  );
  const paginationContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      flexDirection: "row",
      paddingBottom: theme.spacing["16p"],
      justifyContent: "center",
    }),
    []
  );
  const paginationDotsStyle = useThemeStyles<ViewStyle>(
    theme => ({
      height: 6,
      width: 6,
      borderRadius: theme.radii.extraSmall,
      marginHorizontal: theme.spacing["4p"],
      marginBottom: theme.spacing["8p"],
      alignSelf: "center",
    }),
    []
  );

  const [step, setStep] = useState(0);
  const ref = useRef<NativeScrollEvent>(null);
  const totalStep = children.length;

  const onPageSelected = (event: PagerViewOnPageSelectedEvent) => {
    const position = event.nativeEvent.position;
    if (position !== step) {
      setStep(position);
    }
  };

  const onButtonPress = () => {
    if (step + 1 === totalStep) {
      onFinishPress();
    } else {
      setStep(step + 1);
      ref?.current?.setPage(step + 1);
    }
  };

  return (
    <SafeAreaView style={container}>
      <NavHeader onBackPress={onBackPress} color="white" end={step + 1 < totalStep && end ? end : undefined} />
      <AnimatedPagerView style={styles.PagerView} onPageSelected={onPageSelected} ref={ref}>
        {children}
      </AnimatedPagerView>
      <View style={paginationContainerStyle}>
        {times(totalStep, i => (
          <View key={i}>
            <View style={[paginationDotsStyle, step === i ? activeDotStyle : inactiveDotStyle]} />
          </View>
        ))}
      </View>
      <Button variant="secondary" color="alt" onPress={onButtonPress}>
        {step + 1 !== totalStep ? buttonText : lastButtonText}
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  PagerView: {
    flex: 1,
  },
});
