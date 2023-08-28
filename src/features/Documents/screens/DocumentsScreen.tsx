import { t } from "i18next";
import { useState } from "react";
import { Pressable, ViewStyle } from "react-native";

import { FilterIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { useThemeStyles } from "@/theme";

export default function DocumentsScreen() {
  const [isFilterModalVisible, setIsFilterModalVisible] = useState<boolean>(false);

  const iconWrapperStyle = useThemeStyles<ViewStyle>(theme => ({
    marginLeft: "auto",
    marginRight: theme.spacing["20p"],
  }));

  return (
    <Page insets={["left", "right"]}>
      <NavHeader
        variant="angled"
        title={t("Documents.DocumentScreen.title")}
        end={
          <Pressable onPress={() => setIsFilterModalVisible(true)} style={iconWrapperStyle}>
            <FilterIcon />
          </Pressable>
        }
      />

      <ContentContainer>{isFilterModalVisible ? <></> : null}</ContentContainer>
    </Page>
  );
}
