import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { GalleryImage } from "../components";
import { goalImages } from "../mocks/mockGoalImages";

export default function ImageGalleryScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [selectedImageId, setSelectedImageId] = useState<string | undefined>();

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    paddingBottom: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["12p"],
    gap: theme.spacing["16p"],
  }));

  const handleOnClose = () => {
    navigation.goBack();
  };

  const handleImageSelectPress = () => {
    const selectedImage = goalImages.find(item => item.id === selectedImageId);

    if (selectedImage) {
      const selectedImageURL = selectedImage.ImageURL;
      navigation.navigate("GoalGetter.CreateGoalScreen", { selectedImageURL });
    }
  };

  return (
    <Page>
      <NavHeader
        title={t("GoalGetter.imageGallery.title")}
        withBackButton={false}
        end={<NavHeader.CloseEndButton onPress={handleOnClose} />}
      />
      <View style={contentStyle}>
        <FlatList
          data={goalImages}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <GalleryImage
              id={item.id}
              imageURL={item.ImageURL}
              isSelected={selectedImageId === item.id}
              onImageSelection={(id: string) => setSelectedImageId(id)}
            />
          )}
        />
        <Button onPress={handleImageSelectPress}>{t("GoalGetter.imageGallery.buttonSave")} </Button>
      </View>
    </Page>
  );
}
