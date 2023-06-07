import EncryptedStorage from "react-native-encrypted-storage";

const setItemInEncryptedStorage = async (key: string, value: string): Promise<void> => {
  await EncryptedStorage.setItem(key, value);
};
const removeItemFromEncryptedStorage = async (key: string): Promise<void> => {
  await EncryptedStorage.removeItem(key);
};
const getItemFromEncryptedStorage = async (key: string): Promise<string | null> => {
  const data = await EncryptedStorage.getItem(key);
  return data ?? null;
};

const hasItemInStorage = async (key: string): Promise<boolean> => {
  const data = await EncryptedStorage.getItem(key);
  return data ? true : false;
};

export { getItemFromEncryptedStorage, hasItemInStorage, removeItemFromEncryptedStorage, setItemInEncryptedStorage };
