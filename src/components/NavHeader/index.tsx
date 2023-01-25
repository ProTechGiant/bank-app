import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StatusBar, StatusBarStyle, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

import { BackIcon, CloseIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

interface NavHeaderProps {
  title: string;
  backButton: boolean;
  backButtonHandler?: () => void;
  closeButtonHandler?: () => void;
  barStyle?: StatusBarStyle | null | undefined;
  color?: "black" | "white";
  rightComponent?: { text: string; handler: () => void } | "close";
  children?: ReactNode;
}

export default function NavHeader({
  title,
  backButton,
  barStyle,
  backButtonHandler,
  closeButtonHandler,
  color = "black",
  rightComponent,
  children,
}: NavHeaderProps) {
  const { i18n } = useTranslation();

  const container = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.regular,
      paddingTop: theme.spacing.medium,
      paddingBottom: 14,
    }),
    []
  );
  const iconDimension = useThemeStyles<number>(theme => theme.iconDimensions.link, []);

  const navigation = useNavigation();

  const handleOnClose = () => {
    if (!closeButtonHandler) {
      navigation.navigate("Temporary.LandingScreen");
    } else {
      return closeButtonHandler();
    }
  };

  const handleOnBack = () => {
    if (!backButtonHandler) {
      navigation.goBack();
    } else {
      return backButtonHandler();
    }
  };

  return (
    <View>
      <StatusBar barStyle={barStyle} />
      <View style={container}>
        <View style={styles.iconWrapper}>
          {backButton && (
            <Pressable onPress={handleOnBack} style={{ transform: [{ scaleX: i18n.dir() === "ltr" ? 1 : -1 }] }}>
              <BackIcon height={iconDimension} width={iconDimension} color={color} />
            </Pressable>
          )}
        </View>
        {title && (
          <View style={styles.textWrapper}>
            <Typography.Text color="neutralBase+30" weight="medium" size="callout">
              {title}
            </Typography.Text>
          </View>
        )}
        {rightComponent === "close" ? (
          <View style={styles.iconWrapper}>
            <Pressable onPress={handleOnClose}>
              <CloseIcon height={iconDimension} width={iconDimension} color={color} />
            </Pressable>
          </View>
        ) : (
          rightComponent?.text &&
          rightComponent?.handler && (
            <TouchableOpacity onPress={rightComponent.handler}>
              <Typography.Text color="primaryBase-10">{rightComponent.text}</Typography.Text>
            </TouchableOpacity>
          )
        )}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: "center",
  },
  textWrapper: {
    alignItems: "center",
  },
});
