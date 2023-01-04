import Carousel from "@/components/Carousel";
import { rewardSectionData } from "@/mocks/rewardSectionData";
import { duplicateArr } from "@/theme/mappings";
import { spacing } from "@/theme/values";

import RewardSectionContent from "./rewardSectionContent";

// for looping functionality we will first multiply the array to ensure smooth rendering
const newData = rewardSectionData.length > 1 ? duplicateArr(rewardSectionData, 6) : [...rewardSectionData];

export default function RewardSection() {
  return (
    <Carousel data={newData} Slide={RewardSectionContent} pagination={false} width={330 + spacing.small} loop={true} />
  );
}
