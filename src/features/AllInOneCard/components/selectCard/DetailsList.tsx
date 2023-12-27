import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";

import { BlackDiamondIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import SvgIcon from "@/components/SvgIcon/SvgIcon";
import { useTheme, useThemeStyles } from "@/theme";

import { CardData, CardTypes } from "../../types";

interface DetailsListProps {
  details: CardData;
}

export default function DetailsList({ details }: DetailsListProps) {
  const { t } = useTranslation();
  const isNeraCard = details.cardType === CardTypes.NERA;

  const { theme } = useTheme();
  const containerTextStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["12p"],
    paddingHorizontal: theme.spacing["20p"],
  }));
  const scrollListContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));
  const scrollListPart2ContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    backgroundColor: theme.palette["neutralBase-40"],
    width: "100%",
    paddingVertical: theme.spacing["12p"],
  }));
  const extraSpaceStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["32p"],
  }));
  const recommendedContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["4p"],
    paddingHorizontal: theme.spacing["8p"],
    borderRadius: theme.radii.extraSmall,
    backgroundColor: theme.palette["primaryBase-70"],
  }));
  const benefitsContainerViewStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    paddingHorizontal: theme.spacing["64p"],
    paddingVertical: theme.spacing["12p"],
    borderRadius: theme.radii.medium,
    backgroundColor: theme.palette["neutralBase-40"],
  }));
  const freeBenefitsViewStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "center",
    gap: -theme.spacing["8p"],
  }));

  return (
    <ScrollView style={styles.fullWidth} testID="AllInOneCard.SelectCardScreen:scrollView">
      <Stack direction="vertical" gap="24p">
        <Stack direction="vertical" gap="8p" style={containerTextStyle}>
          {isNeraCard ? (
            <Typography.Text size="title1" weight="medium">
              {t("AllInOneCard.SelectedCardScreen.neraCard")}
            </Typography.Text>
          ) : (
            <Stack direction="horizontal" gap="8p" align="center">
              <Stack direction="horizontal" align="center">
                <BlackDiamondIcon />
                <Typography.Text size="title1" weight="medium">
                  {t("AllInOneCard.SelectedCardScreen.neraPlus")}
                </Typography.Text>
              </Stack>
              <View style={recommendedContainerStyle}>
                <Typography.Text size="caption2" weight="medium">
                  {t("AllInOneCard.SelectedCardScreen.recommended")}
                </Typography.Text>
              </View>
            </Stack>
          )}
          {isNeraCard ? (
            <Typography.Text size="callout" color="neutralBase-10">
              {t("AllInOneCard.SelectedCardScreen.free")}
            </Typography.Text>
          ) : (
            <Stack direction="horizontal" gap="8p" align="center">
              <Typography.Text size="callout" color="neutralBase-10">
                {details.yearlyFee} {t("AllInOneCard.SelectedCardScreen.SARYearly")}
              </Typography.Text>
              <Typography.Text size="callout" color="neutralBase-10">
                |
              </Typography.Text>
              <Typography.Text size="callout" color="neutralBase-10">
                {details.monthlyFee} {t("AllInOneCard.SelectedCardScreen.SARMonthly")}
              </Typography.Text>
            </Stack>
          )}
        </Stack>
        <Stack direction="vertical" gap="16p" style={scrollListContainerStyle}>
          {details.benefits.slice(0, isNeraCard ? 5 : 6).map((item, index) => (
            <Stack direction="horizontal" gap="12p" align="center" key={index} style={styles.ninetiethWidth}>
              <SvgIcon uri={item.iconUrl} width={24} height={24} color={theme.palette.complimentBase} />
              <Typography.Text size="callout">{item.title}</Typography.Text>
            </Stack>
          ))}
        </Stack>
        {!isNeraCard ? (
          <Stack direction="vertical" style={[scrollListContainerStyle, styles.fullWidth]} align="center">
            <Stack direction="vertical" gap="8p" align="center" style={benefitsContainerViewStyle}>
              <Stack direction="vertical" align="center">
                <Typography.Text size="callout" weight="bold">
                  {t("AllInOneCard.SelectedCardScreen.freeBenefits")}
                </Typography.Text>
                <Typography.Text size="caption1" color="neutralBase+10" align="center">
                  {t("AllInOneCard.SelectedCardScreen.free2subscription")}
                </Typography.Text>
              </Stack>
              <View style={freeBenefitsViewStyle}>
                {details.partnersBenefits?.map(item => (
                  <SvgIcon uri={item.PartnerLogo} width={24} height={24} />
                ))}
              </View>
            </Stack>
          </Stack>
        ) : null}

        <Stack direction="vertical" gap="16p" style={scrollListPart2ContainerStyle}>
          {details.benefits.map((item, index) => (
            <Stack direction="horizontal" gap="12p" align="flex-start" key={index} style={styles.partWidth}>
              <SvgIcon uri={item.iconUrl} width={24} height={24} color={theme.palette.complimentBase} />
              <Stack direction="vertical" gap="4p">
                <Typography.Text size="callout" weight="medium">
                  {item.title}
                </Typography.Text>
                <Typography.Text size="footnote" color="neutralBase">
                  {item.subTitle}
                </Typography.Text>
              </Stack>
            </Stack>
          ))}
        </Stack>
        <View style={extraSpaceStyle} />
      </Stack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    width: "100%",
  },
  ninetiethWidth: {
    width: "90%",
  },
  partWidth: {
    width: "80%",
  },
});
