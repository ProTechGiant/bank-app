import React from "react";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import useThemeStyles from "@/theme/use-theme-styles";

import TouchableEditIcon from "./EditTouchable";

interface CustomCardProps {
  inputs: Array<{
    label: string;
    value: string;
    isEditable?: boolean;
  }>;
  onPress: () => void;
  title: string;
}

export default function CustomCard({ inputs, onPress, title }: CustomCardProps) {
  const subContainer = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    marginTop: theme.spacing["20p"],
    borderRadius: theme.radii.small,
    borderWidth: 0.5,
    borderColor: theme.palette["neutralBase-20"],
  }));

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    borderRadius: theme.radii.small,
  }));

  const textStyle = useThemeStyles<TextStyle>(theme => ({
    paddingLeft: theme.spacing["16p"],
  }));

  const inputStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["8p"],
    marginBottom: theme.spacing["8p"],
  }));

  const iconContainer = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
    paddingHorizontal: theme.spacing["16p"],
  }));

  return (
    <View style={containerStyle}>
      <Typography.Text color="neutralBase+30" size="title3" weight="medium">
        {title}
      </Typography.Text>
      <View style={subContainer}>
        {inputs.map(input => (
          <View key={input.value} style={inputStyle}>
            <View style={styles.cardItems}>
              <View>
                <Typography.Text color="neutralBase-10" size="callout" style={textStyle}>
                  {input.label}
                </Typography.Text>
                <Typography.Text color="neutralBase+30" size="callout" weight="medium" style={textStyle}>
                  {input.value}
                </Typography.Text>
              </View>
              {input.isEditable ? (
                <View style={iconContainer}>
                  <TouchableEditIcon onPress={onPress} />
                </View>
              ) : null}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardItems: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
