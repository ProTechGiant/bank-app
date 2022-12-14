/* eslint-disable react-native/sort-styles */
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Icons } from "@/assets/icons";
import { iconDimensions, palette, radii, spacing } from "@/theme/values";

import Typography from "../../components/Typography";
import { GreyGradient } from "../../components/LinearGradients/GradientButtons";
import Dropdown from "../../components/Dropdown";

interface MoreInfoDropdownProps {
  title: string;
  children: JSX.Element | JSX.Element[];
}

const MoreInfoDropdown = ({ title, children }: MoreInfoDropdownProps) => {
  // const ChevronUp = Icons["ChevronUp"];
  const DownArrow = Icons.DownArrow;
  const UpArrow = Icons.UpArrow;
  const InfoCircle = Icons["InfoCircle"];

  const [openContent, setOpenContent] = useState<boolean>(false);
  const toggleContent = () => {
    setOpenContent(!openContent);
  };

  return (
    <View style={styles.container}>
      <Dropdown
        title={
          <View style={styles.toggleContainer}>
            <GreyGradient>
              <Pressable onPress={toggleContent}>
                <View style={styles.pressableContainer}>
                  <View style={styles.infoIcon}>
                    <InfoCircle />
                  </View>
                  <Typography.Text weight="semiBold" size="callout" style={styles.title}>
                    {title}
                  </Typography.Text>
                  <View style={styles.toggleIcon}>
                    {openContent ? (
                      <UpArrow color={palette.primaryBase} width={iconDimensions.dropdown} />
                    ) : (
                      <DownArrow color={palette.primaryBase} width={iconDimensions.dropdown} />
                    )}
                  </View>
                </View>
              </Pressable>
            </GreyGradient>
          </View>
        }
        dropdownVisible={openContent}
        content={<View style={styles.contentContainer}>{children}</View>}
      />
    </View>
  );
};

export default MoreInfoDropdown;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: palette["neutralBase-50"],
    borderRadius: radii.extraSmall,
  },
  contentContainer: {
    paddingHorizontal: 40,
    paddingVertical: spacing.medium,
  },
  pressableContainer: {
    padding: spacing.medium,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  toggleContainer: {
    borderRadius: radii.extraSmall,
    overflow: "hidden",
  },
  toggleIcon: {
    height: iconDimensions.accordian,
    width: iconDimensions.accordian,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  infoIcon: {
    height: iconDimensions.accordian,
    width: iconDimensions.accordian,
    justifyContent: "center",
    alignItems: "flex-start",
    marginRight: spacing.small,
  },
  title: {
    flex: 1,
  },
});
