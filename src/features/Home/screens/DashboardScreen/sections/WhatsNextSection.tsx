import { Image } from "react-native";

import Section from "./Section";

interface WhatsNextSectionProps {
  onViewAllPress: () => void;
}

export default function WhatsNextSection({ onViewAllPress }: WhatsNextSectionProps) {
  return (
    <Section title="What's Next" onViewAllPress={onViewAllPress}>
      <Image source={require("./article-placeholder.png")} />
    </Section>
  );
}
