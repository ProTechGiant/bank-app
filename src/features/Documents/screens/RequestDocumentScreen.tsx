import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";

import { SelectDocumentTypeSection } from "../components";

export default function RequestDocumentScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60">
        <NavHeader
          title={t("Documents.RequestDocumentScreen.title")}
          withBackButton={true}
          onBackPress={() => navigation.goBack()}
        />

        <ScrollView contentContainerStyle={styles.scrollViewStyle}>
          <SelectDocumentTypeSection />
        </ScrollView>
      </Page>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  scrollViewStyle: { paddingBottom: 40 },
});
