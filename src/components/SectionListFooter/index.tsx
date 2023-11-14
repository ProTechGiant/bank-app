import { useWindowDimensions, View } from "react-native";

interface SectionListFooterProps {
  isFilterActive: boolean;
  height?: number;
  activeFilterHeight?: number;
}

export default function SectionListFooter({ isFilterActive, height, activeFilterHeight }: SectionListFooterProps) {
  const { height: screenHeight } = useWindowDimensions();
  return (
    <View
      style={{
        marginBottom: isFilterActive ? screenHeight * (activeFilterHeight ?? 0.4) : screenHeight * (height ?? 0.3),
      }}
    />
  );
}
