import { useTranslation } from "react-i18next";
import { Dimensions, StyleSheet, View, ViewStyle } from "react-native";

import { Stack } from "@/components";
import Button from "@/components/Button";
import { useThemeStyles } from "@/theme";

import { CardData, CardTypes, defaultStyleForCard } from "../../types";
import NormalVisaCard from "./NormalVisaCard";
import ShowCardDetails from "./ShowCardDetails";

const DOT_SIZE = 6;
interface CardV2Props {
  cardType?: CardTypes;
  step: number;
  visaData: CardData;
  onApplyPress: () => void;
}
export default function Card({ step, visaData, onApplyPress }: CardV2Props) {
  const { t } = useTranslation();
  const screenWidth = Dimensions.get("window").width;
  const imageWidth = screenWidth - 130;
  const aspectRatio = 162 / 258;
  const imageHeight = imageWidth * aspectRatio;
  const additionalStyle: defaultStyleForCard = {
    cardWidth: imageWidth,
    cardHeight: imageHeight,
    sizeWords: "footnote",
    logoWidth: 57,
    logoHeight: 58,
    visaWidth: 42,
    visaHeight: 14,
  };

  const paginationContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["4p"],
    marginBottom: theme.spacing["24p"],
  }));
  const activeDotStyle = useThemeStyles<ViewStyle>(theme => ({
    width: DOT_SIZE * 2,
    backgroundColor: theme.palette.complimentBase,
    borderRadius: theme.radii.xlarge,
  }));
  const inactiveDotStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.xlarge,
  }));
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["8p"],
    width: "100%",
    height: "100%",
  }));
  const buttonsViewContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    paddingBottom: theme.spacing["20p"],
    backgroundColor: "white",
  }));

  return (
    <View style={containerStyle}>
      <NormalVisaCard haveBorder={true} additionalStyle={additionalStyle} cardType={visaData.cardType} />
      <Stack align="center" direction="horizontal" gap="8p" justify="center" style={paginationContainerStyle}>
        <View style={[styles.dot, step === 0 ? activeDotStyle : inactiveDotStyle]} />
        <View style={[styles.dot, step === 1 ? activeDotStyle : inactiveDotStyle]} />
      </Stack>
      <ShowCardDetails visaData={visaData} />
      <View style={buttonsViewContainerStyle}>
        <Button onPress={onApplyPress} testID="AllInOneCard.SelectCardScreen:button">
          {visaData.cardType === CardTypes.NERA_PLUS
            ? t("AllInOneCard.SelectedCardScreen.applyNeraPlus")
            : t("AllInOneCard.SelectedCardScreen.applyNera")}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    height: DOT_SIZE,
    width: DOT_SIZE,
  },
});
