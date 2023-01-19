import { Carousel } from "@/components/Carousel";
import { rewardSectionData } from "@/mocks/rewardSectionData";
import { useThemeStyles } from "@/theme";
import { duplicateArr } from "@/utils";

import RewardSectionContent from "./rewardSectionContent";

// for looping functionality we will first multiply the array to ensure smooth rendering
const newData = rewardSectionData.length > 1 ? duplicateArr(rewardSectionData, 6) : [...rewardSectionData];

export default function RewardSection() {
  const width = useThemeStyles<number>(theme => 330 + theme.spacing.small, []);
  return <Carousel data={newData} Slide={RewardSectionContent} pagination={false} width={width} loop={true} />;
}
