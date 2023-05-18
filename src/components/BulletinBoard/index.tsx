import times from "lodash/times";
import React, { cloneElement, useRef } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { SvgProps } from "react-native-svg";

import { AngleDownIcon, AngleUpIcon, IconProps } from "@/assets/icons";
import { WithShadow } from "@/components";
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

  const titleContainerStyles = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    padding: theme.spacing["16p"],
  }));

  const paginatorStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    columnGap: 3,
    flexDirection: "row",
    justifyContent: "center",
    height: theme.spacing["32p"],
  }));

  const iconColor = useThemeStyles(theme => theme.palette.complimentBase);

  return (
    <WithShadow backgroundColor="neutralBase-50" borderRadius="extraSmall">
      <View onLayout={event => (boardWidth.current = event.nativeEvent.layout.width)}>
        <WithShadow backgroundColor="neutralBase-50" borderRadius="extraSmall">
          <Pressable onPress={handleOnToggle} style={titleContainerStyles}>
            <Stack align="center" direction="horizontal" gap="8p" style={styles.titleContainer}>
              {cloneElement(iconStart, { color: iconColor })}
              <Typography.Text color="primaryBase" size="callout" weight="semiBold" style={styles.titleText}>
                {title}
              </Typography.Text>
              {isExpanded ? <AngleUpIcon color={iconColor} /> : <AngleDownIcon color={iconColor} />}
            </Stack>
          </Pressable>
        </WithShadow>
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
    </WithShadow>
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
