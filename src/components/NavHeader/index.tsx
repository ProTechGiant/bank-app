import { Pressable, StatusBar, StatusBarStyle, StyleSheet, View, ViewStyle } from "react-native";

import { BackIcon, CloseIcon, CloseWhiteIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";

import { useThemeStyles } from "@/theme";

interface NavHeaderProps {
  title: string;
  backButton: boolean;
  backButtonHandler?: () => void;
  barStyle?: StatusBarStyle | null | undefined;
  color?: "black" | "white";
}

export default function NavHeader({ title, backButton, barStyle, backButtonHandler, color = "black" }: NavHeaderProps) {
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginHorizontal: theme.spacing.small,
      paddingTop: theme.spacing.medium,
    }),
    []
  );
  const iconDimension = useThemeStyles<number>(theme => theme.iconDimensions.link, []);

  const navigation = useNavigation();

  const handleOnClose = () => {
    navigation.navigate("Temporary.LandingScreen");
  };

  const handleOnBack = () => {
    if (!backButtonHandler) {
      navigation.goBack();
    } else {
      return backButtonHandler();
    }
  };

  return (
    <>
      <StatusBar barStyle={barStyle} />
      <View style={container}>
        <View style={styles.iconWrapper}>
          {backButton && (
            <Pressable onPress={handleOnBack}>
              <BackIcon height={iconDimension} width={iconDimension} />
            </Pressable>
          )}
        </View>
        <View style={styles.textWrapper}>
          <Typography.Text color="neutralBase+30" weight="medium" size="callout">
            {title}
          </Typography.Text>
        </View>
        <View style={styles.iconWrapper}>
          <Pressable onPress={handleOnClose}>
            {color === "black" ? (
              <CloseIcon height={iconDimension} width={iconDimension} />
            ) : (
              <CloseWhiteIcon height={iconDimension} width={iconDimension} />
            )}
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: "center",
    width: "10%",
  },
  textWrapper: {
    alignItems: "center",
    width: "80%",
  },
});
