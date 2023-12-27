import { useState } from "react";
import { Platform, View, ViewStyle } from "react-native";

import { Typography } from "@/components";
import CustomStatusBar from "@/components/CustomStatusBar/CustomStatusBar";
import NavHeader from "@/components/NavHeader";
import { useThemeStyles } from "@/theme";

import { DetailsIcon } from "../assets/icons";
import InformationIndicatorsModal from "./InformationIndicatorsModal";

interface HeaderContentProps {
  headerTitle: string;
  children: React.ReactNode;
  showInfoIndicator?: boolean;
  onPress: () => void;
}

export default function HeaderContent({
  children,
  headerTitle,
  showInfoIndicator = false,
  onPress,
}: HeaderContentProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: Platform.OS === "android" ? theme.spacing["12p"] : 0,
  }));

  const NavHeaderColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);

  return (
    <View style={containerStyle}>
      <CustomStatusBar barStyle="light-content" backgroundColor={NavHeaderColor} />
      <NavHeader
        variant="branded"
        backgroundAngledColor={NavHeaderColor}
        title={<Typography.Text color="neutralBase-60">{headerTitle} </Typography.Text>}
        testID="MutualFund.HeaderContent:NavHeader"
        end={showInfoIndicator ? <NavHeader.IconEndButton icon={<DetailsIcon />} onPress={onPress} /> : <></>}>
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
