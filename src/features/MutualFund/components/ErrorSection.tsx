import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { CancelCircleFilledIcon } from "@/assets/icons";
import { Stack } from "@/components";
import Button from "@/components/Button";
import Typography from "@/components/Typography";

interface ErrorSectionProps {
  title: string;
  description: string;
  onPress: () => void;
}

export default function ErrorSection({ title, description, onPress }: ErrorSectionProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.containerStyle}>
      <Stack direction="vertical" gap="48p" justify="center" align="center" style={styles.stackStyle}>
        <CancelCircleFilledIcon />

        <Stack direction="vertical" gap="8p" justify="center" align="center">
          <Typography.Text color="neutralBase+30" size="title3" weight="bold" align="center">
            {title}
          </Typography.Text>
          <Typography.Text
            color="neutralBase+10"
            size="callout"
            weight="regular"
            align="center"
            style={styles.descriptionStyle}>
            {description}
          </Typography.Text>
        </Stack>
      </Stack>
      <Button onPress={onPress}>{t("MutualFund.DiscoverProductsScreen.errorSection.buttonGoBack")}</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
  descriptionStyle: {
    width: 250,
  },
  stackStyle: {
    flex: 1,
  },
});
