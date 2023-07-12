import { useFocusEffect } from "@react-navigation/native";
import { cloneElement, isValidElement, useCallback } from "react";
import { BackHandler, I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { ArrowLeftIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import CloseEndButton, { CloseEndButtonProps } from "./CloseEndButton";
import IconEndButton, { IconEndButtonProps } from "./IconEndButton";
import StatusBar from "./StatusBar";
import TextEndButton, { TextEndButtonProps } from "./TextEndButton";

interface NavHeaderProps {
  onBackPress?: () => void;
  children?: React.ReactElement;
  variant?: "black" | "white" | "background";
  end?: React.ReactElement<CloseEndButtonProps | IconEndButtonProps | TextEndButtonProps>;
  testID?: string;
  title?: string;
  withBackButton?: boolean;
}

const NavHeader = ({
  testID,
  title,
  withBackButton = true,
  onBackPress,
  variant = "black",
  end,
  children,
}: NavHeaderProps) => {
  const navigation = useNavigation();

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
    }, [])
  );

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    paddingVertical: theme.spacing["16p"],
  }));

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

  return (
    <>
      <StatusBar barStyle={variant === "black" ? "dark-content" : "light-content"} />
      <View style={containerStyle} testID={testID}>
        <View style={styles.title}>
          <View style={[styles.column, styles.columnStart]}>
            {withBackButton && (
              <Pressable
                onPress={handleOnBackPress}
                style={[styles.backButton, variant === "background" ? iconBackgroundStyle : undefined]}
                testID={undefined !== testID ? `${testID}-->BackButton` : undefined}>
                <ArrowLeftIcon color={iconColor} width={20} height={20} />
              </Pressable>
            )}
          </View>
          <View style={[styles.column, styles.columnCenter]}>
            {undefined !== title && (
              <Typography.Text color={textColor} weight="medium" size="callout">
                {title}
              </Typography.Text>
            )}
          </View>
          <View style={[styles.column, styles.columnEnd]}>
            {end !== undefined && isValidElement(end)
              ? cloneElement(end, { color: textColor, hasBackground: variant === "background" })
              : undefined}
          </View>
        </View>
        {undefined !== children && <View style={childrenStyles}>{children}</View>}
      </View>
    </>
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

export default NavHeader;
