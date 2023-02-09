import times from "lodash/times";
import { useRef, useState } from "react";
import { Animated, NativeScrollEvent, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import PagerView, { PagerViewOnPageSelectedEvent } from "react-native-pager-view";

import NavHeader from "@/components/NavHeader";
import { CloseEndButtonProps } from "@/components/NavHeader/CloseEndButton";
import { TextEndButtonProps } from "@/components/NavHeader/TextEndButton";
import Page from "@/components/Page";
import { useThemeStyles } from "@/theme";

import DarkOneGradient from "../LinearGradients/GradientBackgrounds";
import Typography from "../Typography";
import HeroSlide, { HeroSlideProps } from "./HeroSlide";

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

interface HeroSliderProps {
  data: HeroSlideProps[];
  onFinishPress: () => void;
  onBackPress?: () => void;
  buttonText: string;
  lastButtonText: string;
  end?: "close" | React.ReactElement<CloseEndButtonProps> | React.ReactElement<TextEndButtonProps> | false;
}

export default function HeroSlider({
  data,
  onFinishPress,
  onBackPress,
  buttonText,
  lastButtonText,
  end,
}: HeroSliderProps) {
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      paddingHorizontal: theme.spacing["16p"],
      paddingBottom: theme.spacing["16p"],
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
      backgroundColor: theme.palette["neutralBase"],
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
  const buttonStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["neutralBase-50"],
      alignItems: "center",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      borderRadius: theme.radii.extraSmall,
      paddingHorizontal: theme.spacing["16p"],
      paddingVertical: theme.spacing["16p"],
    }),
    []
  );

  const [step, setStep] = useState(0);
  const ref = useRef<NativeScrollEvent>(null);
  const totalStep = data.length;

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
    <DarkOneGradient>
      <Page>
        <NavHeader onBackPress={onBackPress} color="white" end={step + 1 < totalStep && end ? end : undefined} />
        <View style={container}>
          <AnimatedPagerView style={styles.PagerView} onPageSelected={onPageSelected} ref={ref}>
            {times(totalStep, i => (
              <HeroSlide key={i} topElement={data[i].topElement} title={data[i].title} subText={data[i].subText} />
            ))}
          </AnimatedPagerView>
          <View style={paginationContainerStyle}>
            {times(totalStep, i => (
              <View key={i}>
                <View style={[paginationDotsStyle, step === i ? activeDotStyle : inactiveDotStyle]} />
              </View>
            ))}
          </View>
          {/* @TODO: change to <Button> once we have this variation in design system */}
          <Pressable style={buttonStyle} onPress={onButtonPress}>
            <Typography.Text color="neutralBase+30" size="body" weight="regular">
              {step + 1 !== totalStep ? buttonText : lastButtonText}
            </Typography.Text>
          </Pressable>
        </View>
      </Page>
    </DarkOneGradient>
  );
}

const styles = StyleSheet.create({
  PagerView: {
    flex: 1,
  },
});
