import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  AddNoteScreen,
  BeneficiaryDeclarationModal,
  BeneficiaryProfileScreen,
  ChangeVerifiedScreen,
  ConfirmationScreen,
  ConfirmLocalTransferBeneficiaryScreen,
  ConfirmNewBeneficiaryScreen,
  EnterBeneficiaryDetailsScreen,
  EnterQuickTransferBeneficiaryScreen,
  InternalTransferScreen,
  IVRCheckScreen,
  IVRWaitingVerificationScreen,
  QuickTransferScreen,
  QuickTransferSuccessScreen,
  ReviewLocalTransferScreen,
  ReviewTransferScreen,
  SendToBeneficiaryScreen,
  StandardTransferNewBeneficiaryScreen,
  StandardTransferScreen,
  TansfersLandingScreen,
  TermsAndConditionsModal,
  TransferSettingScreen,
  WaitingVerificationScreen,
} from "./screens";
import ContactsScreen from "./screens/ContactsScreen";
import EnterLocalTransferBeneficiaryScreen from "./screens/EnterLocalTransferBeneficiaryScreen";
import InternalTransferCTCAndCTAScreen from "./screens/InternalTransferCTCAndCTAScreen";
import TransferPaymentScreen from "./screens/TransferPaymentScreen";
import { AddBeneficiarySelectionType, AddNoteParams, Bank, Contact } from "./types";

export type InternalTransfersStackParams = {
  "Transfers.TrasnfersLandingScreen": undefined;
  "InternalTransfers.SendToBeneficiaryScreen": undefined;
  "InternalTransfers.EnterBeneficiaryDetailsScreen": undefined;
  "InternalTransfers.PaymentsHubScreen": undefined;
  "InternalTransfers.TransferSettingScreen": undefined;
  "InternalTransfers.ConfirmNewBeneficiaryScreen": undefined;
  "InternalTransfers.InternalTransferScreen":
    | {
        ResetForm: boolean;
      }
    | undefined;
  "InternalTransfers.ReviewTransferScreen": undefined;
  "InternalTransfers.AddNoteScreen": AddNoteParams;
  "InternalTransfers.BeneficiaryDeclarationModal": undefined;
  "InternalTransfers.ConfirmationScreen": undefined;
  "InternalTransfers.TermsAndConditionsModal": undefined;
  "InternalTransfers.StandardTransferNewBeneficiaryScreen": undefined;
  "InternalTransfers.QuickTransferScreen":
    | {
        PaymentAmount: number;
        ReasonCode: string;
      }
    | undefined;
  "InternalTransfers.EnterQuickTransferBeneficiaryScreen": undefined;
  "InternalTransfers.TransferPaymentScreen": undefined;
  "InternalTransfers.EnterLocalTransferBeneficiaryScreen": undefined;
  "InternalTransfers.StandardTransferScreen":
    | {
        PaymentAmount?: number;
        ReasonCode?: string;
      }
    | undefined;
  "InternalTransfers.ConfirmLocalTransferBeneficiaryScreen": {
    PaymentAmount: number;
    isStandardFlow?: boolean;
    ReasonCode: string;
    Beneficiary: {
      FullName: string;
      Bank: Bank;
      SelectionType: AddBeneficiarySelectionType;
      SelectionValue: string;
      IBAN: string | undefined;
      type?: string;
      nickname?: string;
      beneficiaryId: string;
      BankName: string | undefined;
    };
  };
  "InternalTransfers.BeneficiaryProfileScreen": {
    Beneficiary: {
      FullName: string;
      Bank: Bank;
      SelectionType: AddBeneficiarySelectionType;
      SelectionValue: string;
      IBAN: string | undefined;
      type?: string;
      nickname?: string;
      beneficiaryId: string;
      BankName: string | undefined;
      active: boolean;
    };
  };
  "InternalTransfers.ReviewLocalTransferScreen": {
    PaymentAmount: number;
    ReasonCode: string;
    Beneficiary: {
      beneficiaryId: string;
      FullName: string;
      Bank: Bank;
      SelectionType?: AddBeneficiarySelectionType;
      SelectionValue?: string;
      IBAN: string;
      type?: string;
    };
  };
  "InternalTransfers.QuickTransferSuccessScreen": {
    PaymentAmount: number;
    BeneficiaryFullName: string;
  };
  "InternalTransfers.IVRCheckScreen": undefined;
  "InternalTransfers.WaitingVerificationScreen": undefined;
  "InternalTransfers.IVRWaitingVerificationScreen": undefined;
  "InternalTransfers.ChangeVerifiedScreen": undefined;
  "InternalTransfers.InternalTransferCTCAndCTAScreen":
    | undefined
    | {
        name?: string;
        phoneNumber?: string;
      };
  "InternalTransfers.ContactsScreen":
    | undefined
    | {
        onContactSelected: (contact: Contact) => void;
      };
};

export const Stack = createNativeStackNavigator<InternalTransfersStackParams>();

export default function InternalTransfersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={TansfersLandingScreen} name="Transfers.TrasnfersLandingScreen" />
      <Stack.Screen component={InternalTransferScreen} name="InternalTransfers.InternalTransferScreen" />
      <Stack.Screen component={SendToBeneficiaryScreen} name="InternalTransfers.SendToBeneficiaryScreen" />
      <Stack.Screen component={ReviewTransferScreen} name="InternalTransfers.ReviewTransferScreen" />
      <Stack.Screen component={AddNoteScreen} name="InternalTransfers.AddNoteScreen" />
      <Stack.Screen component={EnterBeneficiaryDetailsScreen} name="InternalTransfers.EnterBeneficiaryDetailsScreen" />
      <Stack.Screen component={ConfirmNewBeneficiaryScreen} name="InternalTransfers.ConfirmNewBeneficiaryScreen" />
      <Stack.Screen component={TransferSettingScreen} name="InternalTransfers.TransferSettingScreen" />
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
      <Stack.Screen component={TransferPaymentScreen} name="InternalTransfers.TransferPaymentScreen" />
      <Stack.Screen component={ConfirmationScreen} name="InternalTransfers.ConfirmationScreen" />
      <Stack.Screen
        component={EnterQuickTransferBeneficiaryScreen}
        name="InternalTransfers.EnterQuickTransferBeneficiaryScreen"
      />
      <Stack.Screen
        component={EnterLocalTransferBeneficiaryScreen}
        name="InternalTransfers.EnterLocalTransferBeneficiaryScreen"
      />
      <Stack.Screen
        component={ConfirmLocalTransferBeneficiaryScreen}
        name="InternalTransfers.ConfirmLocalTransferBeneficiaryScreen"
      />
      <Stack.Screen component={BeneficiaryProfileScreen} name="InternalTransfers.BeneficiaryProfileScreen" />
      <Stack.Screen component={ReviewLocalTransferScreen} name="InternalTransfers.ReviewLocalTransferScreen" />
      <Stack.Screen component={QuickTransferSuccessScreen} name="InternalTransfers.QuickTransferSuccessScreen" />
      <Stack.Screen
        component={StandardTransferNewBeneficiaryScreen}
        name="InternalTransfers.StandardTransferNewBeneficiaryScreen"
      />
      <Stack.Screen component={IVRCheckScreen} name="InternalTransfers.IVRCheckScreen" />
      <Stack.Screen component={WaitingVerificationScreen} name="InternalTransfers.WaitingVerificationScreen" />
      <Stack.Screen component={IVRWaitingVerificationScreen} name="InternalTransfers.IVRWaitingVerificationScreen" />
      <Stack.Screen component={ChangeVerifiedScreen} name="InternalTransfers.ChangeVerifiedScreen" />
      <Stack.Screen
        component={InternalTransferCTCAndCTAScreen}
        name="InternalTransfers.InternalTransferCTCAndCTAScreen"
      />
      <Stack.Screen
        component={ContactsScreen}
        name="InternalTransfers.ContactsScreen"
        options={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  );
}
