import EncryptedStorage from "react-native-encrypted-storage";

export async function setItemInEncryptedStorage(key: string, value: string) {
  await EncryptedStorage.setItem(key, value);
}

export async function removeItemFromEncryptedStorage(key: string) {
  await EncryptedStorage.removeItem(key);
}

export async function getItemFromEncryptedStorage(key: string) {
  const data = await EncryptedStorage.getItem(key);
  return data ?? null;
}

export async function hasItemInStorage(key: string) {
  const data = await EncryptedStorage.getItem(key);
  return data ? true : false;
}

export async function clearStorage() {
  await EncryptedStorage.clear();
}
