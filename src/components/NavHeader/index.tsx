import { cloneElement, isValidElement } from "react";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { ChevronLeftIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import CloseEndButton, { CloseEndButtonProps } from "./CloseEndButton";
import StatusBar from "./StatusBar";
import TextEndButton, { TextEndButtonProps } from "./TextEndButton";

interface NavHeaderProps {
  onBackPress?: () => void;
  children?: React.ReactElement;
  color?: "black" | "white";
  end?: "close" | React.ReactElement<CloseEndButtonProps> | React.ReactElement<TextEndButtonProps> | false;
  testID?: string;
  title?: string;
  withBackButton?: boolean;
}

const NavHeader = ({
  testID,
  title,
  withBackButton = true,
  onBackPress,
  color = "black",
  end,
  children,
}: NavHeaderProps) => {
  const navigation = useNavigation();

  const handleOnClose = () => {
    navigation.navigate("Temporary.LandingScreen");
  };

  const handleOnBackPress = () => {
    if (undefined === onBackPress) navigation.goBack();
    else onBackPress();
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing.regular,
    paddingVertical: theme.spacing.medium,
  }));

  const childrenStyles = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing.medium,
  }));

  const backIconSize = useThemeStyles<number>(theme => theme.iconDimensions.chevronLeft);
  const textColor = color === "white" ? "neutralBase-50" : "primaryBase+30";
  const iconColor = useThemeStyles(theme => theme.palette[textColor], [textColor]);

  return (
    <>
      <StatusBar barStyle={color === "black" ? "dark-content" : "light-content"} />
      <View style={containerStyle} testID={testID}>
        <View style={styles.title}>
          <View style={[styles.column, styles.columnStart]}>
            {withBackButton && (
              <Pressable
                onPress={handleOnBackPress}
                style={{ transform: [{ scaleX: !I18nManager.isRTL ? 1 : -1 }] }}
                testID={undefined !== testID ? `${testID}-->BackButton` : undefined}>
                <ChevronLeftIcon height={backIconSize} width={backIconSize} color={iconColor} />
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
            {end === "close" ? (
              <CloseEndButton color={textColor} onPress={handleOnClose} />
            ) : isValidElement(end) ? (
              cloneElement(end, { color: textColor })
            ) : undefined}
          </View>
        </View>
        {undefined !== children && <View style={childrenStyles}>{children}</View>}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  column: {
    flex: 1 / 3,
  },
  columnCenter: {
    alignItems: "center",
    flexGrow: 1,
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

export default NavHeader;
