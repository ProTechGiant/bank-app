import { useEffect } from "react";

import { useAuthContext } from "@/contexts/AuthContext";
import deepLinkService from "@/services/deepLink/deepLinkService";

export const useDeepLinkHandler = () => {
  const auth = useAuthContext();

  useEffect(() => {
    deepLinkService.init(auth.isAuthenticated);
    deepLinkService.startListening();

    return () => deepLinkService.stopListening();
  }, []);

  useEffect(() => {
    deepLinkService.onAuthenticationStateChanged(auth.isAuthenticated);
  }, [auth.isAuthenticated]);
};
