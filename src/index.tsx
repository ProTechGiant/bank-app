import { useEffect, useState } from "react";
import { View } from "react-native";

import useAppsFlyer from "@/hooks/use-appsflyer";
import { getSelectedLanguage, initializeI18n } from "@/i18n";
import { initializeAppleWalletAsync } from "@/utils/apple-wallet";

import CroatiaApp from "./CroatiaApp";

// load all data before we can start rendering the app
export default function Trampoline() {
  const appsFlyer = useAppsFlyer();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function main() {
      appsFlyer.initializeSdk();
      initializeAppleWalletAsync();

      const language = await getSelectedLanguage();
      initializeI18n(language);
      setIsReady(true);
    }

    main();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isReady ? <CroatiaApp /> : <View />;
}
