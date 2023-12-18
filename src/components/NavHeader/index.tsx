import { useFocusEffect } from "@react-navigation/native";
import { cloneElement, isValidElement, useCallback } from "react";
import { BackHandler, ColorValue, I18nManager, Platform, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import DeviceInfo from "react-native-device-info";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AngledIcon, ArrowLeftIcon, BrandedIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { palette } from "@/theme/values";

import AddButton, { AddButtonProps } from "./AddButton";
import BoldTitle from "./BoldTitle";
import CloseEndButton, { CloseEndButtonProps } from "./CloseEndButton";
import DeleteEndButton, { DeleteEndButtonProps } from "./DeleteEndButton";
import IconEndButton, { IconEndButtonProps } from "./IconEndButton";
import ShareButton, { ShareButtonProps } from "./ShareButton";
import StatusBar from "./StatusBar";
import TextEndButton, { TextEndButtonProps } from "./TextEndButton";

export interface NavHeaderProps {
  onBackPress?: () => void;
  children?: React.ReactElement | Array<React.ReactElement>;
  variant?: "black" | "white" | "background" | "angled" | "branded";
  end?: React.ReactElement<
    | CloseEndButtonProps
    | IconEndButtonProps
    | TextEndButtonProps
    | AddButtonProps
    | DeleteEndButtonProps
    | ShareButtonProps
  >;
  testID?: string;
  title?: string | React.ReactElement;
  subTitle?: string;
  withBackButton?: boolean;
  backButton?: React.ReactElement<CloseEndButtonProps | IconEndButtonProps | TextEndButtonProps | ShareButtonProps>;
  backgroundAngledColor?: string;
  hasBackButtonIconBackground?: boolean;
  pageNumber?: string;
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
  backgroundColor,
  hasBackButtonIconBackground,
  pageNumber,
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
    backgroundColor: hasBackButtonIconBackground ? theme.palette["neutralBase-60-60%"] : theme.palette.transparent,
    borderRadius: 16,
    height: 32,
    width: 32,
  }));

  const textColorVariant = backgroundAngledColor === palette["neutralBase+30"] ? "neutralBase-60" : "neutralBase+30";

  const iconColor = useThemeStyles(theme => theme.palette[textColorVariant]);

  const backgroundAngledColorDefault = useThemeStyles(theme => theme.palette["neutralBase+30"]);
  const backgroundAngledColorFinal = backgroundAngledColor ? backgroundAngledColor : backgroundAngledColorDefault;

  const getStatusBarHeight = (): number => {
    return Platform.OS === "android" && !DeviceInfo.hasNotch() ? StatusBar.currentHeight ?? 0 : 0;
  };

  const titleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["8p"],
  }));
  const containerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: variant === "angled" || variant === "branded" ? backgroundAngledColorFinal : backgroundColor,
      paddingHorizontal: theme.spacing["20p"],
      paddingBottom: theme.spacing["12p"],
      paddingTop: theme.spacing["12p"] + getStatusBarHeight() + (DeviceInfo.hasNotch() ? insets.top : 0),
    }),
    [backgroundAngledColorFinal, backgroundColor, variant]
  );

  return (
    <View style={styles.elevated}>
      <View style={containerStyle} testID={testID}>
        <View style={[styles.title, titleStyle]}>
          <View style={[styles.column, styles.columnStart]}>
            {withBackButton && (
              <Pressable
                onPress={handleOnBackPress}
                style={[
                  styles.backButton,
                  variant === "background" || variant === "angled" || variant === "branded"
                    ? iconBackgroundStyle
                    : undefined,
                ]}
                testID={undefined !== testID ? `${testID}-BackButton` : undefined}>
                {backButton === undefined || !isValidElement(backButton) ? (
                  <ArrowLeftIcon color={iconColor} width={20} height={20} />
                ) : (
                  cloneElement(backButton, {
                    hasBackground: variant === "background" || variant === "angled" || variant === "branded",
                  })
                )}
              </Pressable>
            )}
          </View>
          <View style={[styles.column, styles.columnCenter]}>
            {title !== undefined && typeof title === "string" ? (
              <Typography.Text color={textColorVariant} weight="medium" size="callout">
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
            {end !== undefined && isValidElement(end) && pageNumber === undefined
              ? cloneElement(end, {
                  color: textColorVariant,
                  hasBackground: variant === "background" || variant === "angled" || variant === "branded",
                  testID,
                })
              : undefined}
            {pageNumber !== undefined && end === undefined ? (
              <Typography.Text>{pageNumber}</Typography.Text>
            ) : undefined}
          </View>
        </View>
        {undefined !== children && <View style={childrenStyles}>{children}</View>}
      </View>
      {variant === "angled" ? <AngledIcon width="101%" color={backgroundAngledColor} /> : null}
      {variant === "branded" ? <BrandedIcon width="101%" color={backgroundAngledColor} /> : null}
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
NavHeader.ShareButton = ShareButton;
NavHeader.BoldTitle = BoldTitle;
NavHeader.AddButton = AddButton;
NavHeader.DeleteEndButton = DeleteEndButton;

export default NavHeader;
