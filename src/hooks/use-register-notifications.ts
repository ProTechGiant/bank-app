import { warn } from "@/logger";
import { getItemFromEncryptedStorage, setItemInEncryptedStorage } from "@/utils/encrypted-storage";
import notifications from "@/utils/push-notifications";

export default function useRegisterNotifications() {
  const requestPermissions = () => {
    return notifications.requestPermissions();
  };

  const register = async (phoneNumber: string) => {
    const alreadyCompleted = (await getItemFromEncryptedStorage("isUserRegisteredToNotification")) === "1";
    if (alreadyCompleted) return true;

    try {
      await requestPermissions();
      await notifications.registerForNotifications();

      await notifications.registerWithT2(phoneNumber);
      await setItemInEncryptedStorage("isUserRegisteredToNotification", "1");
    } catch (error) {
      await setItemInEncryptedStorage("isUserRegisteredToNotification", "0");
      warn("push-notifications", "failed to register for push notifications", error);
    }
  };

  return { register, requestPermissions };
}
