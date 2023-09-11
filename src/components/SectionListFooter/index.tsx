import { useWindowDimensions, View } from "react-native";

interface SectionListFooterProps {
  isFilterActive: boolean;
}

export default function SectionListFooter({ isFilterActive }: SectionListFooterProps) {
  const { height: screenHeight } = useWindowDimensions();
  return <View style={{ marginBottom: isFilterActive ? screenHeight * 0.4 : screenHeight * 0.3 }} />;
}
