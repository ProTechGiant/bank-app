import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PaymentsHubTabs from "./PaymentsHubTabs";
import {
  AddNoteScreen,
  BeneficiaryDeclarationModal,
  ConfirmationScreen,
  ConfirmNewBeneficiaryScreen,
  ConfirmQuickTransferBeneficiaryScreen,
  EnterBeneficiaryDetailsScreen,
  EnterQuickTransferBeneficiaryScreen,
  InternalTransferScreen,
  QuickTransferScreen,
  QuickTransferSuccessScreen,
  ReviewQuickTransferScreen,
  ReviewTransferScreen,
  SendToBeneficiaryScreen,
  StandardTransferScreen,
  TermsAndConditionsModal,
} from "./screens";
import { AddBeneficiarySelectionType, AddNoteParams, Bank } from "./types";

export type InternalTransfersStackParams = {
  "InternalTransfers.SendToBeneficiaryScreen": undefined;
  "InternalTransfers.EnterBeneficiaryDetailsScreen": undefined;
  "InternalTransfers.PaymentsHubScreen": undefined;
  "InternalTransfers.ConfirmNewBeneficiaryScreen": undefined;
  "InternalTransfers.InternalTransferScreen": undefined;
  "InternalTransfers.ReviewTransferScreen": undefined;
  "InternalTransfers.AddNoteScreen": AddNoteParams;
  "InternalTransfers.BeneficiaryDeclarationModal": undefined;
  "InternalTransfers.ConfirmationScreen": undefined;
  "InternalTransfers.TermsAndConditionsModal": undefined;
  "InternalTransfers.QuickTransferScreen":
    | {
        PaymentAmount: number;
        ReasonCode: string;
      }
    | undefined;
  "InternalTransfers.EnterQuickTransferBeneficiaryScreen": {
    PaymentAmount: number;
    ReasonCode: string;
  };
  "InternalTransfers.StandardTransferScreen":
    | {
        PaymentAmount?: number;
        ReasonCode?: string;
      }
    | undefined;
  "InternalTransfers.ConfirmQuickTransferBeneficiaryScreen": {
    PaymentAmount: number;
    ReasonCode: string;
    Beneficiary: {
      FullName: string;
      Bank: Bank;
      SelectionType: AddBeneficiarySelectionType;
      SelectionValue: string;
      IBAN: string;
    };
  };
  "InternalTransfers.ReviewQuickTransferScreen": {
    PaymentAmount: number;
    ReasonCode: string;
    Beneficiary: {
      FullName: string;
      Bank: Bank;
      SelectionType: AddBeneficiarySelectionType;
      SelectionValue: string;
      IBAN: string;
    };
  };
  "InternalTransfers.QuickTransferSuccessScreen": {
    PaymentAmount: number;
    BeneficiaryFullName: string;
  };
};

export const Stack = createNativeStackNavigator<InternalTransfersStackParams>();

export default function InternalTransfersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={PaymentsHubTabs} name="InternalTransfers.PaymentsHubScreen" />
      <Stack.Screen component={InternalTransferScreen} name="InternalTransfers.InternalTransferScreen" />
      <Stack.Screen component={SendToBeneficiaryScreen} name="InternalTransfers.SendToBeneficiaryScreen" />
      <Stack.Screen component={ReviewTransferScreen} name="InternalTransfers.ReviewTransferScreen" />
      <Stack.Screen component={AddNoteScreen} name="InternalTransfers.AddNoteScreen" />
      <Stack.Screen component={EnterBeneficiaryDetailsScreen} name="InternalTransfers.EnterBeneficiaryDetailsScreen" />
      <Stack.Screen component={ConfirmNewBeneficiaryScreen} name="InternalTransfers.ConfirmNewBeneficiaryScreen" />
      <Stack.Screen
        component={BeneficiaryDeclarationModal}
        name="InternalTransfers.BeneficiaryDeclarationModal"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        component={TermsAndConditionsModal}
        name="InternalTransfers.TermsAndConditionsModal"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen component={QuickTransferScreen} name="InternalTransfers.QuickTransferScreen" />
      <Stack.Screen component={StandardTransferScreen} name="InternalTransfers.StandardTransferScreen" />
      <Stack.Screen component={ConfirmationScreen} name="InternalTransfers.ConfirmationScreen" />
      <Stack.Screen
        component={EnterQuickTransferBeneficiaryScreen}
        name="InternalTransfers.EnterQuickTransferBeneficiaryScreen"
      />
      <Stack.Screen
        component={ConfirmQuickTransferBeneficiaryScreen}
        name="InternalTransfers.ConfirmQuickTransferBeneficiaryScreen"
      />
      <Stack.Screen component={ReviewQuickTransferScreen} name="InternalTransfers.ReviewQuickTransferScreen" />
      <Stack.Screen component={QuickTransferSuccessScreen} name="InternalTransfers.QuickTransferSuccessScreen" />
    </Stack.Navigator>
  );
}
