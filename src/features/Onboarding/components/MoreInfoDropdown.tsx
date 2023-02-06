import { useState } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { DownArrowIcon, InfoCircleIcon, UpArrowIcon } from "@/assets/icons";
import Dropdown from "@/components/Dropdown";
import { GreyGradient } from "@/components/LinearGradients/GradientButtons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface MoreInfoDropdownProps {
  title: string;
  children: JSX.Element | JSX.Element[];
}

export default function MoreInfoDropdown({ title, children }: MoreInfoDropdownProps) {
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      width: "100%",
      backgroundColor: theme.palette["neutralBase-50"],
      borderRadius: theme.radii.extraSmall,
    }),
    []
  );
  const contentContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingHorizontal: 40,
      paddingVertical: theme.spacing["16p"],
    }),
    []
  );
  const pressableContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      padding: theme.spacing["16p"],
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
    }),
    []
  );
  const toggleContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      borderRadius: theme.radii.extraSmall,
      overflow: "hidden",
    }),
    []
  );
  const toggleIconStyle = useThemeStyles<ViewStyle>(
    theme => ({
      height: theme.iconDimensions.accordian,
      width: theme.iconDimensions.accordian,
      justifyContent: "center",
      alignItems: "flex-end",
    }),
    []
  );
  const infoIconStyle = useThemeStyles<ViewStyle>(
    theme => ({
      height: theme.iconDimensions.accordian,
      width: theme.iconDimensions.accordian,
      justifyContent: "center",
      alignItems: "flex-start",
      marginRight: theme.spacing["8p"],
    }),
    []
  );
  const primaryBaseColor = useThemeStyles<string>(theme => theme.palette.primaryBase, []);
  const iconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.dropdown, []);

  const [openContent, setOpenContent] = useState<boolean>(false);

  return (
    <View style={container}>
      <Dropdown
        title={
          <View style={toggleContainerStyle}>
            <GreyGradient>
              <Pressable onPress={() => setOpenContent(c => !c)}>
                <View style={pressableContainerStyle}>
                  <View style={infoIconStyle}>
                    <InfoCircleIcon />
                  </View>
                  <Typography.Text color="primaryBase" weight="semiBold" size="callout" style={styles.title}>
                    {title}
                  </Typography.Text>
                  <View style={toggleIconStyle}>
                    {openContent ? (
                      <UpArrowIcon color={primaryBaseColor} width={iconDimensions} />
                    ) : (
                      <DownArrowIcon color={primaryBaseColor} width={iconDimensions} />
                    )}
                  </View>
                </View>
              </Pressable>
            </GreyGradient>
          </View>
        }
        dropdownVisible={openContent}
        content={<View style={contentContainerStyle}>{children}</View>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    flex: 1,
  },
});
