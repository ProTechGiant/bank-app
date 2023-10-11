import { useState } from "react";
import { Platform, View, ViewStyle } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import { Typography } from "@/components";
import NavHeader from "@/components/NavHeader";
import { useThemeStyles } from "@/theme";

import InformationIndicatorsModal from "./InformationIndicatorsModal";

interface HeaderContentProps {
  headerTitle: string;
  children: React.ReactNode;
  showInfoIndicator?: boolean;
}

export default function HeaderContent({ children, headerTitle, showInfoIndicator = false }: HeaderContentProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: Platform.OS === "android" ? -theme.spacing["48p"] : -theme.spacing["20p"],
  }));

  const handleOnPressInfoIcon = () => {
    setIsVisible(true);
  };

  return (
    <View style={containerStyle}>
      <NavHeader
        variant="angled"
        title={<Typography.Text color="neutralBase-60">{headerTitle} </Typography.Text>}
        end={
          showInfoIndicator ? (
            <NavHeader.IconEndButton icon={<InfoCircleIcon />} onPress={handleOnPressInfoIcon} />
          ) : (
            <></>
          )
        }
        backgroundAngledColor="#002233">
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
