import { Pressable, StatusBar, StatusBarStyle, StyleSheet, View } from "react-native";

import { Icons } from "@/assets/icons";
import useNavigation from "@/navigation/use-navigation";
import { iconDimensions, spacing } from "@/theme/values";

import Typography from "../Typography";

interface NavHeaderProps {
  title: string;
  backButton: boolean;
  backButtonHandler?: () => void;
  barStyle?: StatusBarStyle | null | undefined;
  color?: "black" | "white";
}

export default function NavHeader({ title, backButton, barStyle, backButtonHandler, color = "black" }: NavHeaderProps) {
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
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          {backButton && (
            <Pressable onPress={handleOnBack}>
              <Icons.Back height={iconDimensions.link} width={iconDimensions.link} />
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
              <Icons.Close height={iconDimensions.link} width={iconDimensions.link} />
            ) : (
              <Icons.CloseWhite height={iconDimensions.link} width={iconDimensions.link} />
            )}
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: spacing.small,
    paddingTop: spacing.medium,
  },
  iconWrapper: {
    alignItems: "center",
    width: "10%",
  },
  textWrapper: {
    alignItems: "center",
    width: "80%",
  },
});
