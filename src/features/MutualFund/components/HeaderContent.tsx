import { useState } from "react";
import { Platform, View, ViewStyle } from "react-native";

import { Typography } from "@/components";
import NavHeader from "@/components/NavHeader";
import { useThemeStyles } from "@/theme";

import { DetailsIcon } from "../assets/icons";
import InformationIndicatorsModal from "./InformationIndicatorsModal";

interface HeaderContentProps {
  headerTitle: string;
  children: React.ReactNode;
  showInfoIndicator?: boolean;
}

export default function HeaderContent({ children, headerTitle, showInfoIndicator = false }: HeaderContentProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: Platform.OS === "android" ? theme.spacing["12p"] : 0,
  }));

  const handleOnPressInfoIcon = () => {
    setIsVisible(true);
  };

  return (
    <View style={containerStyle}>
      <NavHeader
        variant="branded"
        title={<Typography.Text color="neutralBase-60">{headerTitle} </Typography.Text>}
        testID="MutualFund.HeaderContent:NavHeader"
        end={
          showInfoIndicator ? <NavHeader.IconEndButton icon={<DetailsIcon />} onPress={handleOnPressInfoIcon} /> : <></>
        }>
        <View>{children}</View>
      </NavHeader>
      <InformationIndicatorsModal
        isVisible={isVisible}
        onPressInfoIcon={() => {
          setIsVisible(false);
        }}
      />
    </View>
  );
}
