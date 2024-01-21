import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import { AngleDownIcon, AngleUpIcon, InfoCircleIcon } from "@/assets/icons";
import { GreyGradient } from "@/components/LinearGradients/GradientButtons";
import Typography from "@/components/Typography";
import { Theme, useThemeStyles } from "@/theme";

interface AccordionProps {
  children: JSX.Element | JSX.Element[];
  title: string;
  icon?: JSX.Element;
  backgroundColor?: keyof Theme["palette"];
  showIcon?: boolean;
}

export default function Accordion({
  children,
  title,
  icon,
  backgroundColor = "neutralBase-50",
  showIcon = true,
}: AccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();

  const a11yLabelPrefix = isExpanded ? "AccessibilityHelpers.close" : "AccessibilityHelpers.open";
  const accessibilityLabel = `${t(a11yLabelPrefix)} ${title}`;

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-50"],
    borderRadius: theme.radii.small,
    overflow: "hidden",
    width: "100%",
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    backgroundColor: theme.palette["neutralBase-60"],
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.palette["supportBase-20"],
    borderBottomLeftRadius: theme.radii.small,
    borderBottomRightRadius: theme.radii.small,
  }));

  const pressableContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["12p"],
    height: theme.spacing["64p"],
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.palette[backgroundColor],
  }));

  const iconContainer = useThemeStyles<ViewStyle>(theme => ({
    marginRight: theme.spacing["12p"],
  }));

  const infoIconColor = useThemeStyles(theme => theme.palette.neutralBase);
  const anglesIconColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);

  const titleStyles = useThemeStyles<TextStyle>(() => ({
    flexGrow: 1,
    flex: 1,
    flexWrap: "wrap",
  }));

  return (
    <View style={containerStyle}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ expanded: isExpanded }}
        onPress={() => setIsExpanded(prevIsExpanded => !prevIsExpanded)}>
        <GreyGradient>
          <View style={pressableContainerStyle}>
            {showIcon ? (
              <View style={iconContainer}>
                {icon ? icon : <InfoCircleIcon width={16} height={16} color={infoIconColor} />}
              </View>
            ) : null}

            <Typography.Text color="neutralBase+30" weight="medium" size="footnote" style={titleStyles}>
              {title}
            </Typography.Text>
            <View style={styles.toggleIcon}>
              {isExpanded ? <AngleUpIcon color={anglesIconColor} /> : <AngleDownIcon color={anglesIconColor} />}
            </View>
          </View>
        </GreyGradient>
      </Pressable>
      {isExpanded && <View style={contentStyle}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  toggleIcon: {
    alignItems: "flex-end",
    height: 24,
    justifyContent: "center",
    width: 24,
  },
});
