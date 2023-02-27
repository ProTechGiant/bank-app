import { Pressable, View } from "react-native";
import { SvgProps } from "react-native-svg";

import { ChevronRightIcon, IconProps } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { FAQCategory } from "./types/frequentlyAskedQuestions";

interface SectionProps {
  data: FAQCategory;
  icon: React.ReactElement<SvgProps | IconProps>;
}

export default function Section({ data, icon }: SectionProps) {
  const iconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.faqSectionIcons);
  const iconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-20"]);

  const naviation = useNavigation();

  const handleOnPress = () => {
    naviation.navigate("FrequentlyAskedQuestions.SectionScreen", { data: data?.sections, title: data?.category_name });
  };

  return (
    <Pressable onPress={handleOnPress}>
      <Stack direction="horizontal" gap="20p">
        {icon}
        <Stack direction="vertical" gap="4p" flex={1}>
          <Typography.Text size="callout" weight="medium">
            {data.category_name}
          </Typography.Text>
          <Typography.Text color="neutralBase" size="footnote" weight="regular">
            {data.category_description}
          </Typography.Text>
        </Stack>
        <View style={{ alignSelf: "center" }}>
          <ChevronRightIcon height={iconDimensions} width={iconDimensions} color={iconColor} />
        </View>
      </Stack>
    </Pressable>
  );
}
