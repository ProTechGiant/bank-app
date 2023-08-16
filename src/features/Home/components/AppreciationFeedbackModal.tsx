import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, ImageStyle, SafeAreaView, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { ThumbsDownIcon, ThumbsUpIcon } from "@/assets/icons";
import whiteTriangleHorizontal from "@/assets/white-triangle-horizontal.png";
import Button from "@/components/Button";
import Chip from "@/components/Chip";
import SimpleTextInput from "@/components/Input/SimpleTextInput";
import Modal from "@/components/Modal";
import NavHeader from "@/components/NavHeader";
import NetworkImage from "@/components/NetworkImage";
import NotificationModal from "@/components/NotificationModal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { FeedbackStatus, FeedbackType, NotificationModalVariant } from "../types";

const mockedData: FeedbackType = {
  title: "Andy Pitcher Music Ticket",
  imageUrl: "https://i.ibb.co/CV1JGGX/Adobe-Stock-575962456-1.png",
};

interface AppreciationFeedbackModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AppreciationFeedbackModal({ visible, onClose }: AppreciationFeedbackModalProps) {
  const { height: windowHeight } = useWindowDimensions();
  const { t } = useTranslation();

  const [isNotificationModalVisible, setIsNotificationModalVisible] = useState<boolean>(false);
  const [notificationModalVariant, setNotificationModalVariant] = useState<NotificationModalVariant>(
    NotificationModalVariant.error
  );
  const [feedbackStatus, setFeedbackStatus] = useState<FeedbackStatus>(FeedbackStatus.idle);
  const [feedbackComment, setFeedbackComment] = useState<string>("");

  const handleOnCloseModal = () => {
    setFeedbackComment("");
    setFeedbackStatus(FeedbackStatus.idle);
    onClose();
  };

  const handleOnBackPress = () => {
    if (feedbackStatus === FeedbackStatus.idle) {
      handleOnCloseModal();
    } else {
      openNotificationModal(NotificationModalVariant.error);
    }
  };

  const openNotificationModal = (variant: NotificationModalVariant) => {
    setNotificationModalVariant(variant);
    setIsNotificationModalVisible(true);
  };

  const handleOnCloseNotificationModalPress = () => {
    setIsNotificationModalVisible(false);
    handleOnCloseModal();
  };

  const handleOnFeedbackChipPress = (currentStatus: FeedbackStatus) => {
    if (feedbackStatus === currentStatus) {
      setFeedbackStatus(FeedbackStatus.idle);
    } else {
      setFeedbackStatus(currentStatus);
    }
    setFeedbackComment("");
  };

  const handleOnSubmitButtonPress = () => {
    if (feedbackComment.length === 0 || (feedbackComment.length >= 5 && feedbackComment.trim() !== "")) {
      //TODO submit the feedback to the backend here
      openNotificationModal(NotificationModalVariant.success);
    }
  };

  const questionContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
    alignItems: "stretch",
    justifyContent: "space-between",
  }));

  const answersContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
  }));

  const headerContainerStyle = useThemeStyles<ViewStyle>(() => ({
    height: windowHeight * 0.6,
  }));

  const imageStyle = useThemeStyles<ImageStyle>(theme => ({
    borderRadius: theme.spacing["12p"],
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    height: "100%",
    width: "100%",
  }));

  return (
    <Modal visible={visible} style={styles.modalStyle} padding={0}>
      <ScrollView style={styles.containerStyle} showsVerticalScrollIndicator={false}>
        <View style={headerContainerStyle}>
          <SafeAreaView style={styles.headerStyle}>
            <NavHeader
              title={mockedData.title}
              onBackPress={handleOnBackPress}
              end={<NavHeader.CloseEndButton onPress={handleOnBackPress} />}
              variant="background"
            />
          </SafeAreaView>
          <NetworkImage style={imageStyle} source={{ uri: mockedData.imageUrl }} />
          <Image source={whiteTriangleHorizontal} style={styles.whiteTriangleImageStyle} resizeMode="stretch" />
        </View>
        <Stack direction="vertical" gap="16p" style={questionContainerStyle}>
          <Typography.Header size="small" weight="medium" align="left">
            {t("Home.AppreciationFeedback.question")}
          </Typography.Header>
          <Stack direction="horizontal" gap="16p" style={answersContainerStyle}>
            <Chip
              title={t("Home.AppreciationFeedback.positiveAnswer")}
              onPress={() => handleOnFeedbackChipPress(FeedbackStatus.positive)}
              isRemovable={false}
              isSelected={feedbackStatus === FeedbackStatus.positive}
              leftIcon={<ThumbsUpIcon />}
            />
            <Chip
              title={t("Home.AppreciationFeedback.negativeAnswer")}
              onPress={() => handleOnFeedbackChipPress(FeedbackStatus.negative)}
              isRemovable={false}
              isSelected={feedbackStatus === FeedbackStatus.negative}
              leftIcon={<ThumbsDownIcon />}
            />
          </Stack>
          {feedbackStatus !== FeedbackStatus.idle ? (
            <SimpleTextInput
              label={t("Home.AppreciationFeedback.comments")}
              extraStart={t("Home.AppreciationFeedback.minNumberOfCharactersInComment")}
              numberOfLines={5}
              multiline={true}
              maxLength={100}
              showCharacterCount={true}
              onChangeText={newComment => setFeedbackComment(newComment)}
              value={feedbackComment}
            />
          ) : null}
          <Button disabled={feedbackStatus === FeedbackStatus.idle} onPress={handleOnSubmitButtonPress}>
            {t("Home.AppreciationFeedback.continue")}
          </Button>
        </Stack>

        <NotificationModal
          variant={notificationModalVariant}
          title={
            notificationModalVariant === NotificationModalVariant.error
              ? t("Home.AppreciationFeedback.errorModalTitle")
              : t("Home.AppreciationFeedback.successModalTitle")
          }
          message={
            notificationModalVariant === NotificationModalVariant.error
              ? t("Home.AppreciationFeedback.errorModalMessage")
              : t("Home.AppreciationFeedback.successModalMessage")
          }
          isVisible={isNotificationModalVisible}
          onClose={() => setIsNotificationModalVisible(false)}
          buttons={{
            primary: (
              <Button onPress={handleOnCloseNotificationModalPress}>
                {notificationModalVariant === NotificationModalVariant.error
                  ? t("Home.AppreciationFeedback.errorModalButton")
                  : t("Home.AppreciationFeedback.successModalButton")}
              </Button>
            ),
          }}
        />
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    height: "100%",
    width: "100%",
  },
  headerStyle: {
    position: "absolute",
    width: "100%",
    zIndex: 1,
  },
  modalStyle: {
    height: "95%",
  },
  whiteTriangleImageStyle: {
    bottom: 0,
    position: "absolute",
    width: "100%",
  },
});
