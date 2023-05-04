import { Image } from "react-native";

import Section from "./Section";
import { useTranslation } from "react-i18next";

interface WhatsNextSectionProps {
  onViewAllPress: () => void;
}

export default function WhatsNextSection({ onViewAllPress }: WhatsNextSectionProps) {
  const { t } = useTranslation();
  return (
    <Section title={t("Home.DashboardScreen.whatsNext")} onViewAllPress={onViewAllPress}>
      <Image source={require("../assets/article-placeholder.png")} />
    </Section>
  );
}
