import { isEqual } from "lodash";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, FlatList, View, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import Button from "@/components/Button";
import CustomStatusBar from "@/components/CustomStatusBar/CustomStatusBar";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import CategoryCard from "../components/CategoryCard";
import { usePredefinedCategory, useSubmitLifeStyleInterests } from "../hooks/query-hooks";

export default function LifeStyleScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { isLoading, data: categories } = usePredefinedCategory();

  const prevSelectedCategoriesRef = useRef<string[]>([]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [isButtonDisabled, setButtonDisabled] = useState(true);

  const submitLifeStyleInterestsAsync = useSubmitLifeStyleInterests();

  useEffect(() => {
    if (categories) {
      const preSelectedCategories = categories
        .filter(category => category.Selected)
        .map(category => category.CategoryId);
      setSelectedCategories(preSelectedCategories);
      prevSelectedCategoriesRef.current = [...preSelectedCategories].sort();
    }
  }, [categories]);

  useEffect(() => {
    const isSameAsPrevious = isEqual(prevSelectedCategoriesRef.current, selectedCategories.sort());
    setButtonDisabled(isSameAsPrevious);
  }, [selectedCategories]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategories(prevSelected => {
      const isSelected = prevSelected.includes(category);

      if (isSelected) {
        return prevSelected.filter(item => item !== category);
      } else {
        return [...prevSelected, category];
      }
    });
  };

  const handleOnSave = async () => {
    const submitValues = selectedCategories.map(categoryId => ({
      CategoryId: categoryId,
    }));
    try {
      setButtonDisabled(true);
      await submitLifeStyleInterestsAsync.mutateAsync(submitValues);
      navigation.goBack();
    } catch (error) {
      warn("LifeStyles interests", ` ${(error as Error).message}`);
    }
  };

  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["8p"],
    width: "100%",
  }));

  const subTitleStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    paddingTop: theme.spacing["12p"],
    marginBottom: theme.spacing["20p"],
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    paddingBottom: theme.spacing["24p"],
    marginTop: theme.spacing["20p"],
  }));

  const buttonStyle = useThemeStyles<ViewStyle>(theme => ({
    zIndex: 1,
    marginBottom: theme.spacing["24p"],
    paddingHorizontal: theme.spacing["20p"],
  }));

  const gradientStyle = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    bottom: 0,
    height: 158,
    borderRadius: theme.spacing["4p"],
    pointerEvents: "none",
    zIndex: 0,
    width: "100%",
  }));

  const NavHeaderColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);

  return (
    <Page insets={["left", "right", "bottom"]} backgroundColor="neutralBase-60">
      <CustomStatusBar barStyle="light-content" backgroundColor={NavHeaderColor} />
      <NavHeader variant="angled" backgroundAngledColor={NavHeaderColor}>
        <View style={headerStyle}>
          <Typography.Header size="large" color="neutralBase-60">
            {`  ${t("Settings.LifeStyleScreen.title")} `}
          </Typography.Header>
        </View>
        <View style={subTitleStyle}>
          <Typography.Text color="neutralBase-50" size="callout" weight="regular">
            {t("Settings.LifeStyleScreen.subTitle")}
          </Typography.Text>
        </View>
        {isLoading ? (
          <ActivityIndicator size="small" />
        ) : (
          <View style={subTitleStyle}>
            {selectedCategories?.length > 0 ? (
              <Typography.Text color="neutralBase-60">
                {selectedCategories.length}/{categories.length}
              </Typography.Text>
            ) : (
              <Typography.Text size="callout" weight="regular" color="neutralBase-60">
                {t("Settings.LifeStyleScreen.pickSomething")}
              </Typography.Text>
            )}
          </View>
        )}
      </NavHeader>
      <FlatList
        contentContainerStyle={contentStyle}
        data={categories}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item?.CategoryId}
        renderItem={({ item }) => (
          <CategoryCard
            category={item}
            isSelected={selectedCategories.includes(item?.CategoryId)}
            onSelect={() => handleCategorySelect(item?.CategoryId)}
          />
        )}
      />
      <View style={buttonStyle}>
        <Button onPress={handleOnSave} disabled={isButtonDisabled}>
          {t("Settings.LifeStyleScreen.saveButton")}
        </Button>
      </View>
      <LinearGradient colors={["#FFFFFF00", "#FFFFFF00", "#FFFFFFDB", "#FFFFFF", "#FFFFFF"]} style={gradientStyle} />
      {/* </SafeAreaView> */}
    </Page>
  );
}
