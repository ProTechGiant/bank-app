import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
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

  const { setGoalContextState, GoalImage } = useGoalGetterContext();

  const selectedImage = useRef<string>("");

  useEffect(() => {
    setSelectedImageId(GoalImage);
  }, []);

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
    setGoalContextState({ GoalImage: selectedImage.current });
    navigation.goBack();
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
                      isSelected={selectedImageId === item.Media[0].SourceFileURL}
                      onImageSelection={() => {
                        if (selectedImageId === item.Media[0].SourceFileURL) {
                          setSelectedImageId("");
                          selectedImage.current = "";
                        } else {
                          setSelectedImageId(item.Media[0].SourceFileURL);
                          selectedImage.current = item.Media[0].SourceFileURL;
                        }
                      }}
                    />
                  );
                }}
              />
              <Button disabled={!selectedImageId} onPress={handleImageSelectPress}>
                {t("GoalGetter.imageGallery.buttonSave")}
              </Button>
            </>
          ) : null}
        </View>
      </View>
    </Page>
  );
}
