import { BillDescriptionListInterface } from "./types";

export function getLanguagePreferredBillDescription(
  languagePreference: string,
  descriptionList: Array<BillDescriptionListInterface>
) {
  if (descriptionList === undefined || descriptionList.length === 0) {
    return "";
  }

  const description = descriptionList.find(bill => bill.LanguagePreference === `${languagePreference}-gb`);
  return description === undefined ? "" : description.Text;
}
