import MainStack from "@/navigation/MainStack";
import { flags } from "@/config/feature-flag";
import { FlagsProvider } from "flagged";

export default function App() {
  return (
    <FlagsProvider features={flags}>
      <MainStack />
    </FlagsProvider>
  );
}
