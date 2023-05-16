import { cloneElement } from "react";
import { I18nManager, Pressable, StyleSheet, View } from "react-native";
import { SvgProps } from "react-native-svg";

import { ChevronRightIcon, IconProps } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { FAQCategory } from "../types";

interface SectionProps {
  data: FAQCategory;
  icon: React.ReactElement<SvgProps | IconProps>;
}

export default function Section({ data, icon }: SectionProps) {
  const navigation = useNavigation();

  const handleOnPress = () => {
    navigation.navigate("FrequentlyAskedQuestions.SectionScreen", { data: data?.sections, title: data?.category_name });
  };

  const rightIconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-20"]);
  const leftIconColor = useThemeStyles<string>(theme => theme.palette["primaryBase-40"]);

  return (
    <Pressable onPress={handleOnPress}>
      <Stack direction="horizontal" gap="20p">
        {cloneElement(icon, {
          color: leftIconColor,
        })}
        <Stack direction="vertical" gap="4p" flex={1}>
          <Typography.Text size="callout" weight="medium">
            {data.category_name}
          </Typography.Text>
          <Typography.Text color="neutralBase" size="footnote" weight="regular">
            {data.category_description}
          </Typography.Text>
        </Stack>
        <View style={styles.chevronContainer}>
          <ChevronRightIcon color={rightIconColor} />
        </View>
      </Stack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chevronContainer: {
    alignSelf: "center",
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
});
