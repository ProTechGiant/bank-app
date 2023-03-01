import { useEffect, useState } from "react";
import { ViewStyle } from "react-native/types";

import Stack from "@/components/Stack";
import Toggle from "@/components/Toggle";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface SubcategorySectionProps {
  title: string;
  content: string;
  mainToggleStatus: boolean;
}

export default function SubcategorySection({ title, content, mainToggleStatus }: SubcategorySectionProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
  }));

  const [toggleStatus, setToggleStatus] = useState(mainToggleStatus);

  useEffect(() => {
    setToggleStatus(mainToggleStatus);
  }, [mainToggleStatus]);

  return (
    <Stack direction="horizontal" gap="16p" align="center" style={containerStyle}>
      <Stack direction="vertical" gap="4p" flex={1}>
        <Typography.Text size="callout" weight="medium">
          {title}
        </Typography.Text>
        <Typography.Text color="neutralBase" size="footnote" weight="regular">
          {content}
        </Typography.Text>
      </Stack>
      <Toggle onPress={() => setToggleStatus(!toggleStatus)} value={toggleStatus} />
    </Stack>
  );
}
