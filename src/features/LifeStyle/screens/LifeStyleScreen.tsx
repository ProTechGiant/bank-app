import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StatusBar, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/components/Button";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import BackgroundCollapsedSvg from "../assets/background-header-collapsed.svg";
import { ArrowBackIcon } from "../assets/icon";
import CategoryCard from "../components/CategoryCard";
import { categories } from "../mocks/categories";

export default function LifeStyleScreen() {
  const { t } = useTranslation();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategorySelect = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(prevSelected => prevSelected.filter(item => item !== category));
    } else {
      setSelectedCategories(prevSelected => [...prevSelected, category]);
    }
  };

  // ToDo when the Api is ready
  const handleOnSave = () => {
    // console.log("Selected category", selectedCategories);
  };

  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["14p"],
    width: "100%",
  }));

  const subTitleStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    paddingTop: theme.spacing["12p"],
    paddingBottom: theme.spacing["12p"],
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingBottom: theme.spacing["24p"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: "transparent",
    marginBottom: theme.spacing["20p"],
    marginTop: theme.spacing["24p"],
    paddingHorizontal: theme.spacing["20p"],
  }));

  return (
    <Page insets={["left", "right", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <View style={styles.backgroundImage}>
        <BackgroundCollapsedSvg />
      </View>
      <SafeAreaView edges={["top"]} style={styles.itemContainer}>
        <View style={headerStyle}>
          <ArrowBackIcon />
          <Typography.Header> {t("Settings.LifeStyleScreen.title")}</Typography.Header>
        </View>
        <View style={subTitleStyle}>
          <Typography.Text color="neutralBase+10" size="callout" weight="regular">
            {t("Settings.LifeStyleScreen.subTitle")}
          </Typography.Text>
        </View>
        <View style={subTitleStyle}>
          {selectedCategories.length > 0 ? (
            <Typography.Text>
              {selectedCategories.length}/{categories.length}
            </Typography.Text>
          ) : (
            <Typography.Text size="callout" weight="regular">
              {t("Settings.LifeStyleScreen.pickSomething")}
            </Typography.Text>
          )}
        </View>
        <ScrollView contentContainerStyle={contentStyle}>
          {categories.map(category => (
            <CategoryCard
              key={category.title}
              title={category.title}
              description={category.description}
              onSelect={() => handleCategorySelect(category.title)}
              isSelected={selectedCategories.includes(category.title)}
              iconName={category.title}
            />
          ))}
        </ScrollView>

        <View style={buttonContainerStyle}>
          <Button onPress={handleOnSave} disabled={selectedCategories.length === 0}>
            {t("Settings.LifeStyleScreen.saveButton")}
          </Button>
        </View>
      </SafeAreaView>
    </Page>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    alignSelf: "center",
  },
  itemContainer: {
    flex: 1,
  },
});
