import { useState } from "react";

import Page from "@/components/Page";

import EditFinancialInformationScreen from "./EditFinancialInformationScreen";
import ViewFinancialInformationScreen from "./ViewFinancialInformationScreen";

export default function FinancialInformationScreen() {
  const [isEditable, setIsEditable] = useState(true);

  return (
    <Page>
      {isEditable ? (
        <ViewFinancialInformationScreen setIsEditable={setIsEditable} isEditable />
      ) : (
        <EditFinancialInformationScreen />
      )}
    </Page>
  );
}
