import { RouteProp, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, FlatList, StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { EmptyError, GalleryImage } from "../components";
import { useGoalGetterContext } from "../contexts/GoalGetterContext";
import { useImageGallery } from "../hooks/query-hooks";

export default function ImageGalleryScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AuthenticatedStackParams, "GoalGetter.ImageGallary">>();
  const [selectedImageId, setSelectedImageId] = useState<string | undefined>();

  const { setGoalContextState } = useGoalGetterContext();
  const { data, isLoading, refetch } = useImageGallery();

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
    const selectedImage = data?.Gallery.find(item => item.ImageId === selectedImageId);
    if (selectedImage) {
      const selectedImageURL = selectedImage.ImageURL;
      if (route.params?.screen) navigation.navigate(route.params.screen, { selectedImageURL });
      else navigation.goBack();
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
        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator />
          </View>
        ) : data?.Gallery ? (
          <>
            <FlatList
              data={data.Gallery}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item.ImageId}
              renderItem={({ item }) => (
                <GalleryImage
                  id={item.ImageId}
                  imageURL={item.ImageURL}
                  isSelected={selectedImageId === item.ImageId}
                  onImageSelection={(id: string) => {
                    setSelectedImageId(id);
                    setGoalContextState({ goalImage: item.ImageURL });
                  }}
                />
              )}
            />
            <Button disabled={selectedImageId === undefined} onPress={handleImageSelectPress}>
              {t("GoalGetter.imageGallery.buttonSave")}
            </Button>
          </>
        ) : (
          <View style={[styles.center, styles.bottomOffset]}>
            <EmptyError
              variant="error"
              title={t("GoalGetter.imageGallery.error.title")}
              message={t("GoalGetter.imageGallery.error.message")}
              isVisible={true}
              buttons={{
                primary: (
                  <Button variant="secondary" onPress={() => refetch()}>
                    {t("GoalGetter.imageGallery.error.buttonReload")}
                  </Button>
                ),
              }}
            />
          </View>
        )}
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  bottomOffset: {
    marginBottom: 100,
  },
  center: {
    flex: 1,
    justifyContent: "center",
  },
});
