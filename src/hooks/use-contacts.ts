import Contacts from "react-native-contacts";
import * as permissions from "react-native-permissions";

import { warn } from "@/logger";

export default function useContacts() {
  const isContactsPermissionGranted = async (platform: string) => {
    let permissionStatus;
    try {
      if (platform === "android") {
        permissionStatus = await permissions.check(permissions.PERMISSIONS.ANDROID.READ_CONTACTS);
      } else {
        permissionStatus = await Contacts.checkPermission();
      }
      if (permissionStatus === permissions.RESULTS.GRANTED || permissionStatus === "authorized") {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      warn("Contacts-Permissions-Status", "Could not get permission Status: ", JSON.stringify(error));
      return false;
    }
  };

  const handleOnRequestContactsPermissions = async (platform: string) => {
    if (platform === "android") {
      return permissions
        .request(permissions.PERMISSIONS.ANDROID.READ_CONTACTS)
        .then(result => {
          console.log("PERMISSION RESULT:", result);
          return Promise.resolve(result);
        })
        .catch(error => {
          return Promise.reject(error);
        });
    } else {
      return Contacts.requestPermission()
        .then(async permission => {
          return Promise.resolve(permission);
        })
        .catch(error => {
          return Promise.reject(error);
        });
    }
  };

  return { requestContactsPermissions: handleOnRequestContactsPermissions, isContactsPermissionGranted };
}
