import { useTranslation } from "react-i18next";
import { Dimensions, I18nManager, StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import Stack from "@/components/Stack";
import SvgIcon from "@/components/SvgIcon/SvgIcon";
import Typography from "@/components/Typography";
import { MaskIcon } from "@/features/AllInOneCard/assets/icons";
import {
  STATUS_ACTIVE,
  STATUS_PENDING_ACTIVATION,
  STATUS_PENDING_Termination,
} from "@/features/AllInOneCard/constants";
import { useThemeStyles } from "@/theme";

import { PartnerItemSubscription } from "../../types";

interface GoalCardProps {
  partnerItem: PartnerItemSubscription;
  onCardPress: () => void;
  status: string;
}

export default function BenefitCard({ partnerItem, onCardPress, status }: GoalCardProps) {
  const { t } = useTranslation();

  const isPending = status === STATUS_PENDING_ACTIVATION || status === STATUS_PENDING_Termination;
  const isActivated = status === STATUS_ACTIVE;
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth - 40;
  const imageWidth = cardWidth * 0.3;
  const ratio = 134 / 96;
  const imageHeight = imageWidth * ratio;

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.medium,
    shadowColor: "rgba(0, 0, 0, 0.06)",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: "white",
    overflow: "hidden",
    height: 138,
  }));
  const progressStackStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["16p"],
    paddingBottom: theme.spacing["16p"],
    height: 134,
    paddingLeft: theme.spacing["24p"],
    width: "70%",
  }));

  const activeContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["4p"],
    paddingHorizontal: theme.spacing["8p"],
    backgroundColor: theme.palette["successBase-20"],
    borderRadius: theme.radii.extraSmall,
    alignItems: "center",
  }));
  const pendingBackgroundStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["secondary_yellowBase-30"],
  }));

  return (
    <Stack direction="horizontal" justify="space-between" style={containerStyle} key={partnerItem.PartnerCode}>
      <Stack direction="vertical" justify="space-between" style={progressStackStyle}>
        <Stack direction="vertical" gap="8p">
          <Stack direction="horizontal" gap="8p">
            <Typography.Text weight="bold">{partnerItem.PartnerName}</Typography.Text>
            {isPending || isActivated ? (
              <View style={[activeContainerStyle, isPending ? pendingBackgroundStyle : {}]}>
                <Typography.Text weight="bold" size="caption1">
                  {isPending ? t("AllInOneCard.BenefitsScreen.pending") : t("AllInOneCard.BenefitsScreen.active")}
                </Typography.Text>
              </View>
            ) : null}
          </Stack>

          <Typography.Text color="neutralBase" size="footnote">
            {partnerItem.PartnerDescription}
          </Typography.Text>
        </Stack>
        {!isActivated ? (
          <Button size="mini" disabled={isPending} onPress={onCardPress}>
            {t("AllInOneCard.BenefitsScreen.activate")}
          </Button>
        ) : null}
      </Stack>
      <View style={styles.imageContainer}>
        <SvgIcon uri={partnerItem.PartnerBackgroundImage} width={imageWidth} height={imageHeight} />
        <View style={styles.positionMask}>
          <MaskIcon />
        </View>
      </View>
    </Stack>
  );
}
const styles = StyleSheet.create({
  imageContainer: {
    width: "30%",
  },
  positionMask: {
    position: "absolute",
    transform: I18nManager.isRTL ? [{ scaleX: -1 }] : [],
  },
});
