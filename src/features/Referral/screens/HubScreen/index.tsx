import Clipboard from "@react-native-clipboard/clipboard";
import { useState } from "react";
import { Dimensions, Platform, ScrollView, TouchableOpacity, View, ViewStyle } from "react-native";

import { FriendIcon, ShareCopyIcon, ShareIcon } from "@/assets/icons";
import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import SectionHeader from "@/components/SectionHeader";
import Toast from "@/components/Toast";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import CopyCodeCard from "./CopyCodeCard";
import RecommendationCards from "./RecommendationCards";

export default function HubScreen() {
  const buttonStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginHorizontal: theme.spacing.regular,
      marginTop: "auto",
    }),
    []
  );
  const captionTextWrapperStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "flex-end",
      flexDirection: "row",
      justifyContent: "center",
      marginTop: theme.spacing.small,
      marginBottom: theme.spacing.xlarge,
    }),
    []
  );
  const headerContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["primaryBase"],
      paddingTop: Platform.OS === "android" ? theme.spacing.small : theme.spacing.large,
      paddingBottom: theme.spacing.large * 2,
    }),
    []
  );
  const headerTextWrapperStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginTop: theme.spacing.large,
      marginHorizontal: theme.spacing.xlarge,
      alignItems: "center",
    }),
    []
  );
  const IconWrapperStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginTop: theme.spacing.regular,
      alignItems: "center",
      justifyContent: "center",
    }),
    []
  );
  const subTextStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginTop: theme.spacing.small,
    }),
    []
  );
  const cardContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginVertical: theme.spacing.small,
      marginHorizontal: theme.spacing.medium,
    }),
    []
  );

  const friendIconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.friendIcon, []);
  const shareIconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.share, []);

  const inProgress = 1;
  const completed = 1;
  const earnt = 15;
  const currency = "SAR";
  const referralCode = "FG4JHAF9";

  const [showToast, setShowToast] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);

  const handleOnCopyCodePress = () => {
    Clipboard.setString(referralCode);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  return (
    <View style={{ flex: 1 }}>
      <Toast showToast={showToast} message="Code copied" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEnabled={Dimensions.get("screen").height <= contentHeight + footerHeight}>
        <View
          onLayout={({ nativeEvent }) => {
            setContentHeight(nativeEvent.layout.height);
          }}>
          <View style={headerContainerStyle}>
            <NavHeader
              title=""
              backButton={true}
              color="white"
              rightComponent={{ text: "How it works", handler: () => {} }}
            />
            <View style={IconWrapperStyle}>
              <FriendIcon height={friendIconDimensions} width={friendIconDimensions} />
            </View>
            <View style={headerTextWrapperStyle}>
              <Typography.Text color="neutralBase-50" weight="semiBold" size="title1">
                Share Croatia
              </Typography.Text>
              <View style={subTextStyle}>
                <Typography.Text color="neutralBase-20" weight="regular" size="callout" style={{ textAlign: "center" }}>
                  Send your referral code and track your rewards
                </Typography.Text>
              </View>
            </View>
          </View>
          <SectionHeader title="your recommendations" />
          <RecommendationCards inProgress={inProgress} completed={completed} earnt={earnt} currency={currency} />
          <SectionHeader title="Copy code" />
          <View style={cardContainerStyle}>
            <CopyCodeCard
              backgroundColor="neutralBase-50"
              leftText={referralCode}
              rightIcon={<ShareCopyIcon />}
              onPress={handleOnCopyCodePress}
            />
          </View>
        </View>
      </ScrollView>
      <View
        style={buttonStyle}
        onLayout={({ nativeEvent }) => {
          setFooterHeight(nativeEvent.layout.height);
        }}>
        <Button
          variant="primary"
          color="alt"
          iconLeft={<ShareIcon height={shareIconDimensions} width={shareIconDimensions} />}>
          <Typography.Text color="neutralBase-50" weight="semiBold" size="callout">
            Share
          </Typography.Text>
        </Button>
        <View style={captionTextWrapperStyle}>
          <Typography.Text size="caption2" color="neutralBase" weight="medium">
            Read more in{" "}
          </Typography.Text>
          <TouchableOpacity>
            <Typography.Text size="caption2" color="interactionBase" weight="medium">
              Terms & Conditions
            </Typography.Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
