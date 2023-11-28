import { RouteProp, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { GalleryImage } from "../components";
import { useGoalGetterContext } from "../contexts/GoalGetterContext";

export default function ImageGalleryScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AuthenticatedStackParams, "GoalGetter.ImageGallary">>();
  const images = route.params.images;
  const [selectedImageId, setSelectedImageId] = useState<string | undefined>();

  const { setGoalContextState } = useGoalGetterContext();

  const modalContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["48p"],
    borderRadius: theme.radii.medium,
    flex: 1,
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    paddingBottom: theme.spacing["16p"],
    gap: theme.spacing["16p"],
  }));

  const handleOnClose = () => {
    navigation.goBack();
  };

  const handleImageSelectPress = () => {
    const selectedImage = images.find(item => item.ImageId === selectedImageId);
    if (selectedImage) {
      const selectedImageURL = selectedImage.ImageURL;
      if (route.params?.screen) navigation.navigate(route.params.screen, { selectedImageURL });
      else navigation.goBack();
    }
  };

  return (
    <Page backgroundColor="neutralBase+30">
      <View style={modalContainerStyle}>
        <NavHeader
          title={t("GoalGetter.imageGallery.title")}
          withBackButton={true}
          end={<NavHeader.CloseEndButton onPress={handleOnClose} />}
        />
        <View style={contentStyle}>
          {images?.length ? (
            <>
              <FlatList
                data={images}
                numColumns={3}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.ContentId}
                renderItem={({ item }) => {
                  return (
                    <GalleryImage
                      id={item.ContentId}
                      imageURL={item.Media[0].SourceFileURL}
                      isSelected={selectedImageId === item.ContentId}
                      onImageSelection={(id: string) => {
                        setSelectedImageId(id);
                        setGoalContextState({ GoalImage: item.Media[0].SourceFileURL });
                      }}
                    />
                  );
                }}
              />
              <Button disabled={selectedImageId === undefined} onPress={handleImageSelectPress}>
                {t("GoalGetter.imageGallery.buttonSave")}
              </Button>
            </>
          ) : null}
        </View>
      </View>
    </Page>
  );
}
