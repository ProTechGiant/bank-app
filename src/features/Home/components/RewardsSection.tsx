import times from "lodash/times";
import { Image, ScrollView, View, ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

import rewardsBackgroundPng from "../assets/rewards-placeholder.png";
import Section from "./Section";

interface RewardsSectionProps {
  onViewAllPress: () => void;
}

export default function RewardsSection({ onViewAllPress }: RewardsSectionProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: -theme.spacing["20p"],
    paddingHorizontal: theme.spacing["20p"],
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    columnGap: theme.spacing["12p"],
    paddingRight: theme.spacing["20p"] * 2, // correct for padding twice
  }));

  return (
    <Section title="Rewards" onViewAllPress={onViewAllPress}>
      <ScrollView
        contentContainerStyle={contentStyle}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={containerStyle}>
        {times(3).map(index => {
          return (
            <View key={index}>
              <Image source={rewardsBackgroundPng} />
            </View>
          );
        })}
      </ScrollView>
    </Section>
  );
}
