import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, ViewStyle } from "react-native";
import Contacts from "react-native-contacts";
import { FlatList, TextInput } from "react-native-gesture-handler";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import { SearchInput } from "@/components/Input";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import { warn } from "@/logger";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import ContactsListItem from "../components/ContactsListItem";
import { ContactsResponse } from "../types";

export default function ContactsScreen() {
  const route = useRoute<RouteProp<AuthenticatedStackParams, "InternalTransfers.ContactsScreen">>();

  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AuthenticatedStackParams, "InternalTransfers.ContactsScreen">>();

  const [contactsArray, setContactsArray] = useState<ContactsResponse[]>([]);
  const [filteredArray, setFilteredArray] = useState<ContactsResponse[]>([]);

  const [contactsObject, setContactsObject] = useState<ContactsResponse | undefined>(undefined);
  const searchInputRef = useRef<TextInput>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isGenericError, setIsGenericError] = useState(false);

  useEffect(() => {
    Contacts.getAll()
      .then(contacts => {
        setContactsArray(contacts);
        setFilteredArray(contacts);
      })
      .catch(e => {
        warn("Unable to fetch contact:", e);
        setIsGenericError(true);
      });
  }, []);

  // applying search filter.
  useEffect(() => {
    if (contactsArray === undefined || contactsArray.length === 0) {
      return;
    }
    const debounceId = setTimeout(() => {
      // filtering the actual data
      const lowerCaseQuery = searchQuery.toLowerCase();

      const searchedArray =
        searchQuery !== ""
          ? contactsArray.filter(function (contactObj) {
              return (
                contactObj.displayName?.toLowerCase().match(lowerCaseQuery) ||
                contactObj.familyName?.toLowerCase().match(lowerCaseQuery) ||
                contactObj.givenName?.toLowerCase().match(lowerCaseQuery) ||
                contactObj.phoneNumbers[0].number.toLowerCase().match(lowerCaseQuery)
              );
            })
          : contactsArray;

      setFilteredArray(searchedArray);
    }, 500);
    return () => clearTimeout(debounceId);
  }, [contactsArray, searchQuery]);

  const handleOnChangeText = (text: string) => {
    if (text === " " && searchQuery === "") return;
    else setSearchQuery(text);
  };
  const handleOnCancelPress = () => {
    setSearchQuery("");
  };

  const handleOnContactItemPress = (item: ContactsResponse) => {
    setContactsObject(item);
  };

  const handleOnCloseScreen = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleOnSelectContactPress = () => {
    if (contactsObject !== undefined) {
      const androidName = contactsObject.displayName !== undefined ? contactsObject.displayName : "";
      const iOSName =
        (contactsObject.givenName !== undefined ? contactsObject.givenName : "") +
        " " +
        (contactsObject.familyName !== undefined ? contactsObject.familyName : "");
      const name = Platform.OS === "android" ? androidName : iOSName;
      if (route.params?.fromScreen !== undefined) {
        navigation.navigate(route.params?.fromScreen, {
          name: name,
          phoneNumber: contactsObject.phoneNumbers[0].number,
        });
      } else if (route.params !== undefined) {
        route.params.onContactSelected({
          name: name,
          phoneNumber: contactsObject.phoneNumbers[0].number,
        });
        navigation.goBack();
      }
    }
  };

  const flatListStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["12p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        withBackButton={false}
        end={<NavHeader.CloseEndButton onPress={handleOnCloseScreen} />}
        title={t("InternalTransfers.ContactsScreen.title")}
        testID="InternalTransfers.InternalTransferCroatiaToCroatiaScreen.ContactsScreen:NavHeader"
      />
      <ContentContainer>
        <SearchInput
          ref={searchInputRef}
          value={searchQuery}
          placeholder={t("InternalTransfers.ContactsScreen.searchPlaceHolder")}
          onClear={handleOnCancelPress}
          onSearch={handleOnChangeText}
          testID="InternalTransfers.InternalTransferCroatiaToCroatiaScreen.ContactsScreen:SearchInput"
        />
        <FlatList
          style={flatListStyle}
          data={filteredArray}
          renderItem={({ item }) => (
            <ContactsListItem
              testID="InternalTransfers.InternalTransferCroatiaToCroatiaScreen.ContactsScreen.Flatlist"
              key={item.recordID}
              fullName={
                Platform.OS === "android"
                  ? item.displayName !== undefined
                    ? item.displayName
                    : ""
                  : (item.givenName !== undefined ? item.givenName : "") +
                    " " +
                    (item.familyName !== undefined ? item.familyName : "")
              }
              contactInfo={item.phoneNumbers[0].number}
              isSelected={contactsObject?.recordID === item.recordID}
              onContactPress={() => {
                handleOnContactItemPress(item);
              }}
            />
          )}
          keyExtractor={item => item.recordID}
        />
        <Button
          variant="primary"
          onPress={handleOnSelectContactPress}
          disabled={contactsObject !== undefined ? false : true}
          testID="InternalTransfers.InternalTransferCroatiaToCroatiaScreen.ContactsScreen:SelectContactButton">
          {t("InternalTransfers.ContactsScreen.selectContact")}
        </Button>
      </ContentContainer>
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isGenericError}
        onClose={() => setIsGenericError(false)}
      />
    </Page>
  );
}
