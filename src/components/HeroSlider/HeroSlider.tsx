import { useRef, useState } from "react";
import { I18nManager, StyleSheet, View, ViewStyle } from "react-native";
import PagerView, { PagerViewOnPageSelectedEvent } from "react-native-pager-view";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import { CloseEndButtonProps } from "@/components/NavHeader/CloseEndButton";
import { IconEndButtonProps } from "@/components/NavHeader/IconEndButton";
import { TextEndButtonProps } from "@/components/NavHeader/TextEndButton";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import { useThemeStyles } from "@/theme";

import BackgroundBottomSvg from "./background-bottom.svg";
import BackgroundTopStartSvg from "./background-top-start.svg";
import HeroSlide, { HeroSlideProps } from "./HeroSlide";

interface HeroSliderProps {
  data: HeroSlideProps[];
  onFinishPress: () => void;
  onBackPress?: () => void;
  buttonText: string;
  lastButtonText: string;
  loading?: boolean;
  variant?: "default" | "prebrand";
  end?: React.ReactElement<CloseEndButtonProps | IconEndButtonProps | TextEndButtonProps>;
  hasBackButton?: boolean;
  children?: React.ReactNode;
  testID?: string;
  title?: string;
  darkTheme?: boolean;
}

export default function HeroSlider({
  data,
  onFinishPress,
  onBackPress,
  buttonText,
  lastButtonText,
  variant = "prebrand",
  loading = false,
  end,
  hasBackButton = true,
  children,
  testID,
  title,
  darkTheme = false,
}: HeroSliderProps) {
  const [step, setStep] = useState(0);
  const pagerViewRef = useRef<PagerView>(null);
  const nextStep = step + 1;

  const handleOnPageSelected = (event: PagerViewOnPageSelectedEvent) => {
    const position = event.nativeEvent.position;

    if (position !== step) {
      setStep(position);
    }
  };

  const handleOnButtonPress = () => {
    if (nextStep === data.length) {
      return onFinishPress();
    }

    setStep(nextStep);
    pagerViewRef?.current?.setPage(nextStep);
  };

  const activeDotStyle = useThemeStyles<ViewStyle>(theme => ({
    width: DOT_SIZE * 2,
    backgroundColor: theme.palette.complimentBase,
  }));

  const inactiveDotStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-30"],
  }));

  const paginationContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["20p"],
  }));

  const pagerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    marginHorizontal: -theme.spacing["20p"],
  }));

  return (
    // according to new design
    <Page backgroundColor={darkTheme ? "primaryBase" : "neutralBase-60"}>
      {variant === "prebrand" ? <BackgroundTopStartSvg style={styles.backgroundTopStart} /> : null}
      {variant === "prebrand" ? <BackgroundBottomSvg style={styles.backgroundBottom} /> : null}
      <NavHeader
        onBackPress={onBackPress}
        end={!hasBackButton ? end : nextStep < data.length && end ? end : undefined}
        withBackButton={hasBackButton}
        title={title}
      />
      <ContentContainer style={styles.content}>
        <PagerView style={pagerStyle} onPageSelected={handleOnPageSelected} ref={pagerViewRef}>
          {data.map(element => (
            <HeroSlide
              key={element.title}
              topElement={element.topElement}
              title={element.title}
              text={element.text}
              bottomElementStyle={element.bottomElementStyle}
              containerStyle={element.containerStyle}
              darkTheme={darkTheme}
            />
          ))}
        </PagerView>
        {/* // to hide dots if its only one item */}
        {data.length > 1 ? (
          <Stack align="center" direction="horizontal" gap="8p" justify="center" style={paginationContainerStyle}>
            {data.map((element, index) => (
              <View key={element.title} style={[styles.dot, step === index ? activeDotStyle : inactiveDotStyle]} />
            ))}
          </Stack>
        ) : null}
        {children !== undefined ? (
          children
        ) : (
          <Button loading={loading} variant="primary" onPress={handleOnButtonPress} testID={testID}>
            {nextStep !== data.length ? buttonText : lastButtonText}
          </Button>
        )}
      </ContentContainer>
    </Page>
  );
}

const DOT_SIZE = 6;

const styles = StyleSheet.create({
  backgroundBottom: {
    bottom: 0,
    position: "absolute",
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
  backgroundTopStart: {
    position: "absolute",
    start: 0,
    top: 0,
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
  content: {
    justifyContent: "space-between",
  },
  dot: {
    height: DOT_SIZE,
    width: DOT_SIZE,
  },
});
