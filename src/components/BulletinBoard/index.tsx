import times from "lodash/times";
import React, { cloneElement, useRef } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { SvgProps } from "react-native-svg";

import { AngleDownIcon, AngleUpIcon, IconProps } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import PaginationDot from "./PaginationDot";

interface BulletinBoardProps {
  children?: Array<React.ReactElement> | undefined;
  isExpanded?: boolean;
  onExpandPress?: (value: boolean) => void;
  iconStart: React.ReactElement<IconProps | SvgProps>;
  title: string;
}

export default function BulletinBoard({ children, isExpanded, onExpandPress, iconStart, title }: BulletinBoardProps) {
  const boardWidth = useRef<number | undefined>(undefined);
  const scrollX = useSharedValue(0);

  const handleOnToggle = () => {
    onExpandPress?.(!isExpanded);
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const shadowStyle = useThemeStyles<ViewStyle>(theme => ({
    shadowColor: theme.palette["neutralBase+30"],
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.14,
    elevation: 5,
  }));

  const containerStyles = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-50"],
    borderRadius: theme.radii.extraSmall,
  }));

  const titleContainerStyles = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-50"],
    borderRadius: theme.radii.extraSmall,
    flexDirection: "row",
    padding: theme.spacing["16p"],
  }));

  const paginatorStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    backgroundColor: theme.palette["neutralBase-50"],
    columnGap: 3,
    flexDirection: "row",
    justifyContent: "center",
    height: 32,
  }));

  const iconColor = useThemeStyles(theme => theme.palette.complimentBase);

  return (
    <View
      onLayout={event => (boardWidth.current = event.nativeEvent.layout.width)}
      style={[containerStyles, shadowStyle]}>
      <Pressable onPress={handleOnToggle} style={[titleContainerStyles, shadowStyle]}>
        <Stack align="center" direction="horizontal" gap="8p" style={styles.titleContainer}>
          {cloneElement(iconStart, { color: iconColor })}
          <Typography.Text color="primaryBase" size="callout" weight="semiBold" style={styles.titleText}>
            {title}
          </Typography.Text>
          {isExpanded ? <AngleUpIcon color={iconColor} /> : <AngleDownIcon color={iconColor} />}
        </Stack>
      </Pressable>
      {isExpanded ? (
        <View>
          <Animated.ScrollView
            decelerationRate="fast"
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={boardWidth.current}
            scrollEventThrottle={64}
            onScroll={scrollHandler}>
            {children?.map((element, index) => {
              return (
                <View key={index} style={{ width: boardWidth.current }}>
                  {element}
                </View>
              );
            })}
          </Animated.ScrollView>
          <View style={paginatorStyle}>
            {times(React.Children.count(children), index => {
              return <PaginationDot key={index} index={index} scrollX={scrollX} width={boardWidth.current ?? 0} />;
            })}
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    width: "100%",
  },
  titleText: {
    flexGrow: 1,
  },
});
