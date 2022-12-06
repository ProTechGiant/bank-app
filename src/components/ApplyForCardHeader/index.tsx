import { Pressable, StyleSheet, View } from "react-native";

import { Icons } from "@/assets/icons";
import useNavigation from "@/navigation/use-navigation";
import { spacing } from "@/theme/values";

import Typography from "../Typography";

interface ApplyCardHeaderProps {
  title: string;
  backButton: boolean;
}

export default function ApplyCardHeader({ title, backButton }: ApplyCardHeaderProps) {
  const CloseIcon = Icons["Close"];
  const BackIcon = Icons["Back"];

  const navigation = useNavigation();

  const handleOnClose = () => {
    navigation.navigate("Temporary.LandingScreen");
  };

  const handleOnBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        {backButton && (
          <Pressable onPress={handleOnBack}>
            <BackIcon height={16} width={16} />
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
          <CloseIcon height={16} width={16} />
        </Pressable>
      </View>
    </View>
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
