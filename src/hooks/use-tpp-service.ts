import { useEffect, useState } from "react";

import { getItemFromEncryptedStorage } from "@/utils/encrypted-storage";

export default function useCheckTPPService() {
  const [comingFromTPP, setComingFromTPP] = useState<string | null>(null);

  useEffect(() => {
    async function checkTPPService() {
      const fromTPP = await getItemFromEncryptedStorage("COMING_FROM_TPP");
      setComingFromTPP(fromTPP);
    }

    checkTPPService();
  }, []);

  return comingFromTPP;
}
