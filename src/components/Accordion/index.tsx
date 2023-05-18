import { useState } from "react";
import { Pressable, View, ViewStyle } from "react-native";

import { AngleDownIcon, AngleUpIcon, InfoFilledCircleIcon } from "@/assets/icons";
import { GreyGradient } from "@/components/LinearGradients/GradientButtons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface AccordionProps {
  children: JSX.Element | JSX.Element[];
  title: string;
}

export default function Accordion({ children, title }: AccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-50"],
    borderRadius: theme.radii.small,
    overflow: "hidden",
    width: "100%",
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    backgroundColor: theme.palette["neutralBase-60"],
    height: theme.spacing.full,
  }));

  const pressableContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["12p"],
    height: theme.spacing["56p"],
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.palette["supportBase-20"],
  }));

  const iconContainer = useThemeStyles<ViewStyle>(theme => ({
    marginRight: theme.spacing["12p"],
  }));

  const infoIconColor = useThemeStyles(theme => theme.palette["primaryBase-40"]);
  const anglesIconColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);

  const toggleIconStyle = useThemeStyles<ViewStyle>(theme => ({
    height: theme.iconDimensions.accordian,
    width: theme.iconDimensions.accordian,
    justifyContent: "center",
    alignItems: "flex-end",
  }));

  const titleStyles = useThemeStyles<ViewStyle>(theme => ({
    flexGrow: 1,
    marginHorizontal: theme.spacing["8p"],
  }));

  return (
    <Pressable onPress={() => setIsExpanded(c => !c)} style={containerStyle}>
      <GreyGradient>
        <View style={pressableContainerStyle}>
          <View style={iconContainer}>
            <InfoFilledCircleIcon width={16} height={16} color={infoIconColor} />
          </View>

          <Typography.Text color="neutralBase+30" weight="medium" size="footnote" style={titleStyles}>
            {title}
          </Typography.Text>
          <View style={toggleIconStyle}>
            {isExpanded ? <AngleUpIcon color={anglesIconColor} /> : <AngleDownIcon color={anglesIconColor} />}
          </View>
        </View>
      </GreyGradient>
      {isExpanded && <View style={contentStyle}>{children}</View>}
    </Pressable>
  );
}
