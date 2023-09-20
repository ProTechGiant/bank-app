import useNavigation from "@/navigation/use-navigation";
import { setItemInEncryptedStorage } from "@/utils/encrypted-storage";

export default function useBlockedUserFlow() {
  const navigation = useNavigation();

  const handle = async (type: "otp" | "passcode", blockTime?: number) => {
    if (!blockTime) {
      await setItemInEncryptedStorage("UserBlocked", JSON.stringify(true));
    } else {
      const userBlockTime = new Date().getTime() + blockTime * 60 * 1000; //TODO: replace with the value from API
      await setItemInEncryptedStorage("UserBlocked", JSON.stringify(userBlockTime));
    }
    handleNavigateToBlockScreen(type);
  };

  const handleNavigateToBlockScreen = (type: "otp" | "passcode") => {
    navigation.navigate("SignIn.UserBlocked", {
      type,
    });
  };

  return { handle };
}
