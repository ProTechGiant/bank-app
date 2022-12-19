import { rewardSectionData } from "@/mocks/rewardSectionData";
import { spacing } from "@/theme/values";
import Carousel from "@/components/Carousel";
import RewardSectionContent from "./rewardSectionContent";
import { duplicateArr } from "@/utils/mappings";
import { StyleSheet, View } from "react-native";

// for looping functionality we will first multiply the array to ensure smooth rendering
const newData = rewardSectionData.length > 1 ? duplicateArr(rewardSectionData, 6) : [...rewardSectionData];

export default function RewardSection() {
  return (
    <View style={styles.container}>
      <Carousel
        data={newData}
        Slide={RewardSectionContent}
        pagination={false}
        width={330 + spacing.small}
        loop={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xlarge,
  },
});
