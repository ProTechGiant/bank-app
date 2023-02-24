import { Pressable, View } from "react-native";
import { SvgProps } from "react-native-svg";

import { ChevronRightIcon, IconProps } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface SectionProps {
  title: string;
  content: string;
  icon: React.ReactElement<SvgProps | IconProps>;
}

export default function Section({ title, content, icon }: SectionProps) {
  const iconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.faqSectionIcons);
  const iconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-20"]);

  return (
    <Pressable>
      <Stack direction="horizontal" gap="20p">
        {icon}
        <Stack direction="vertical" gap="4p" flex={1}>
          <Typography.Text size="callout" weight="medium">
            {title}
          </Typography.Text>
          <Typography.Text color="neutralBase" size="footnote" weight="regular">
            {content}
          </Typography.Text>
        </Stack>
        <View style={{ alignSelf: "center" }}>
          <ChevronRightIcon height={iconDimensions} width={iconDimensions} color={iconColor} />
        </View>
      </Stack>
    </Pressable>
  );
}
