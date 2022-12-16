import { radii } from "@/theme/values";
import { Image } from "react-native";

interface RewardSectionContentProps {
  data: { id: number; image: string };
}

export default function RewardSectionContent({ data }: RewardSectionContentProps) {
  return (
    <Image
      source={data.image}
      style={{
        width: 330,
        height: 180,
        borderRadius: radii.small,
      }}
    />
  );
}
