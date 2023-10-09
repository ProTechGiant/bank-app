import { View } from "react-native";

import { Typography } from "@/components";
import NavHeader from "@/components/NavHeader";

interface HeaderContentProps {
  headerTitle: string;
  children: React.ReactNode;
}

export default function HeaderContent({ children, headerTitle }: HeaderContentProps) {
  return (
    <NavHeader
      variant="angled"
      title={<Typography.Text color="neutralBase-60">{headerTitle} </Typography.Text>}
      backgroundAngledColor="#002233">
      <View>{children}</View>
    </NavHeader>
  );
}
