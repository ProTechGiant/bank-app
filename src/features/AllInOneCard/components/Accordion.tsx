import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import { AngleDownIcon, AngleUpIcon } from "@/assets/icons";
import { Stack } from "@/components";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface AccordionProps {
  children: JSX.Element | JSX.Element[];
  title: string;
  icon?: JSX.Element;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function Accordion({ children, title, icon, isExpanded, onToggle }: AccordionProps) {
  const { t } = useTranslation();
  const a11yLabelPrefix = isExpanded ? "AccessibilityHelpers.close" : "AccessibilityHelpers.open";
  const accessibilityLabel = `${t(a11yLabelPrefix)} ${title}`;

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    paddingVertical: theme.spacing["12p"],
  }));

  const anglesIconColor = useThemeStyles(theme => theme.palette["neutralBase-20"]);
  const anglesUpIconColor = useThemeStyles(theme => theme.palette.complimentBase);

  return (
    <View style={containerStyle}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ expanded: isExpanded }}
        onPress={onToggle}>
        <Stack direction="horizontal" justify="space-between" align="center">
          <Stack direction="horizontal" gap="16p" align="center">
            {icon ? icon : <></>}
            <Typography.Text color={isExpanded ? "complimentBase" : "neutralBase+30"} weight="medium" size="callout">
              {title}
            </Typography.Text>
          </Stack>

          <View>
            {isExpanded ? (
              <AngleUpIcon color={anglesUpIconColor} height={25} width={25} />
            ) : (
              <AngleDownIcon color={anglesIconColor} height={25} width={25} />
            )}
          </View>
        </Stack>
      </Pressable>
      {isExpanded && <View>{children}</View>}
    </View>
  );
}
