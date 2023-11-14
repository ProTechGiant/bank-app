import { useFocusEffect } from "@react-navigation/native";
import { cloneElement, isValidElement, useCallback } from "react";
import { BackHandler, ColorValue, I18nManager, Platform, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import DeviceInfo from "react-native-device-info";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BackgroundBottom from "@/assets/BackgroundBottom";
import { ArrowLeftIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import BoldTitle from "./BoldTitle";
import CloseEndButton, { CloseEndButtonProps } from "./CloseEndButton";
import IconEndButton, { IconEndButtonProps } from "./IconEndButton";
import StatusBar from "./StatusBar";
import TextEndButton, { TextEndButtonProps } from "./TextEndButton";

export interface NavHeaderProps {
  onBackPress?: () => void;
  children?: React.ReactElement | Array<React.ReactElement>;
  variant?: "black" | "white" | "background" | "angled";
  end?: React.ReactElement<CloseEndButtonProps | IconEndButtonProps | TextEndButtonProps>;
  testID?: string;
  title?: string | React.ReactElement;
  subTitle?: string;
  withBackButton?: boolean;
  backButton?: React.ReactElement<CloseEndButtonProps | IconEndButtonProps | TextEndButtonProps>;
  backgroundAngledColor?: string;
  backgroundBottomStyle?: ViewStyle;
  showStatusBar?: boolean;
  backgroundColor?: ColorValue;
}

const NavHeader = ({
  testID,
  title,
  subTitle,
  withBackButton = true,
  onBackPress,
  backButton,
  variant = "black",
  end,
  children,
  backgroundAngledColor,
  backgroundBottomStyle,
  showStatusBar = true,
  backgroundColor,
}: NavHeaderProps) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleOnBackPress = () => {
    if (undefined === onBackPress) navigation.goBack();
    else onBackPress();
  };

  useFocusEffect(
    useCallback(() => {
      const handleOnBackButtonClick = () => {
        if (withBackButton) {
          handleOnBackPress();
        }

        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", handleOnBackButtonClick);

      return () => BackHandler.removeEventListener("hardwareBackPress", handleOnBackButtonClick);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  const childrenStyles = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));

  const iconBackgroundStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60-60%"],
    borderRadius: 16,
    height: 32,
    width: 32,
  }));

  const textColor = variant === "white" ? "neutralBase-50" : "neutralBase+30";
  const iconColor = useThemeStyles(theme => theme.palette[textColor], [textColor]);

  const backgroundAngledColorDefault = useThemeStyles(theme => theme.palette["supportBase-15"]);
  const backgroundAngledColorFinal = backgroundAngledColor ? backgroundAngledColor : backgroundAngledColorDefault;

  const getStatusBarHeight = (): number => {
    return variant === "angled" && Platform.OS === "android" && !DeviceInfo.hasNotch()
      ? StatusBar.currentHeight ?? 0
      : 0;
  };

  const containerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: variant === "angled" ? backgroundAngledColorFinal : backgroundColor,
      paddingHorizontal: theme.spacing["20p"],
      paddingBottom: theme.spacing["16p"],
      paddingTop: theme.spacing["12p"] + getStatusBarHeight() + (variant === "angled" ? insets.top : 0),
    }),
    [backgroundAngledColorFinal, backgroundColor, variant]
  );

  const backgroundBottomStyleDefault = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    bottom: -theme.spacing["24p"] + 1, // Small gap forms on iphone SE, 1 pixel added to remove this.
  }));

  return (
    <View style={styles.elevated}>
      {showStatusBar ? (
        <StatusBar barStyle={variant === "black" || variant === "angled" ? "dark-content" : "light-content"} />
      ) : null}
      <View style={containerStyle} testID={testID}>
        <View style={styles.title}>
          <View style={[styles.column, styles.columnStart]}>
            {withBackButton && (
              <Pressable
                onPress={handleOnBackPress}
                style={[
                  styles.backButton,
                  variant === "background" || variant === "angled" ? iconBackgroundStyle : undefined,
                ]}
                testID={undefined !== testID ? `${testID}-BackButton` : undefined}>
                {backButton === undefined || !isValidElement(backButton) ? (
                  <ArrowLeftIcon color={iconColor} width={20} height={20} />
                ) : (
                  cloneElement(backButton, { hasBackground: variant === "background" || variant === "angled" })
                )}
              </Pressable>
            )}
          </View>
          <View style={[styles.column, styles.columnCenter]}>
            {title !== undefined && typeof title === "string" ? (
              <Typography.Text color={textColor} weight="medium" size="callout">
                {title}
              </Typography.Text>
            ) : (
              title
            )}
            {subTitle !== undefined ? (
              <Typography.Text color="neutralBase" size="caption1" weight="regular">
                {subTitle}
              </Typography.Text>
            ) : null}
          </View>

          <View style={[styles.column, styles.columnEnd]}>
            {end !== undefined && isValidElement(end)
              ? cloneElement(end, {
                  color: textColor,
                  hasBackground: variant === "background" || variant === "angled",
                  testID,
                })
              : undefined}
          </View>
        </View>
        {undefined !== children && <View style={childrenStyles}>{children}</View>}
      </View>
      {variant === "angled" ? (
        <View style={[backgroundBottomStyleDefault, backgroundBottomStyle]}>
          <BackgroundBottom color={backgroundAngledColorFinal} />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    transform: [{ scaleX: !I18nManager.isRTL ? 1 : -1 }],
  },
  column: {
    flex: 1 / 3,
  },
  columnCenter: {
    alignItems: "center",
    flexGrow: 2,
    justifyContent: "center",
  },
  columnEnd: {
    alignItems: "flex-end",
  },
  columnStart: {
    alignItems: "flex-start",
  },
  elevated: {
    zIndex: 1,
  },
  title: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

NavHeader.CloseEndButton = CloseEndButton;
NavHeader.TextEndButton = TextEndButton;
NavHeader.IconEndButton = IconEndButton;
NavHeader.BoldTitle = BoldTitle;

export default NavHeader;
