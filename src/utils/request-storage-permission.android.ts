import { PermissionsAndroid } from "react-native";

export const requestStorageAndroidPermission = async (): Promise<boolean> => {
  try {
    const permissions = [
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    ];
    const granted = await PermissionsAndroid.requestMultiple(permissions);
    if (
      granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED &&
      granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED
    )
      return true;
    return false;
  } catch (err) {
    return false;
  }
};
