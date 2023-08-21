import { Image, ImageSourcePropType, ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface EmptyAppreciationListProps {
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
  buttonText?: string;
  onButtonPress?: () => void;
}

export default function EmptyAppreciationList({
  title,
  subtitle,
  image,
  buttonText,
  onButtonPress,
}: EmptyAppreciationListProps) {
  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["64p"],
    alignItems: "center",
  }));

  const textsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    alignItems: "center",
    marginBottom: theme.spacing["12p"],
  }));

  return (
    <ContentContainer style={contentContainerStyle}>
      <Image source={image} />
      <Stack direction="vertical" gap="8p" style={textsContainerStyle}>
        <Typography.Header size="small" weight="bold" align="center">
          {title}
        </Typography.Header>
        <Typography.Text align="center" size="callout" color="neutralBase+10">
          {subtitle}
        </Typography.Text>
      </Stack>
      {buttonText !== undefined ? (
        <Button variant="secondary" onPress={onButtonPress}>
          {buttonText}
        </Button>
      ) : null}
    </ContentContainer>
  );
}
