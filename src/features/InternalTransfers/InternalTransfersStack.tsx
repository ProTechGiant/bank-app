import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  BeneficiaryDeclarationModal,
  BeneficiaryProfileScreen,
  ChangeVerifiedScreen,
  ConfirmationScreen,
  ConfirmLocalTransferBeneficiaryScreen,
  ConfirmNewBeneficiaryScreen,
  EditNickNameModalScreen,
  EnterBeneficiaryDetailsScreen,
  EnterQuickTransferBeneficiaryScreen,
  GenerateQrScreen,
  InternalTransferScreen,
  IVRCheckScreen,
  IVRWaitingVerificationScreen,
  LocalTransferBeneficiaryScreen,
  QuickTransferScreen,
  QuickTransferSuccessScreen,
  ReviewLocalTransferScreen,
  ReviewTransferScreen,
  SendToBeneficiaryScreen,
  StandardTransferNewBeneficiaryScreen,
  TermsAndConditionsModal,
  TransferSettingScreen,
  TransfersLandingScreen,
  ViewTransactionScreen,
  WaitingVerificationScreen,
} from "./screens";
import ActivateNewBeneficiaryScreen from "./screens/ActivateNewBeneficiaryScreen";
import BeneficiaryListsWithSearchForTransfersScreen from "./screens/BeneficiaryListsWithSearchForTransfersScreen";
import ContactsScreen from "./screens/ContactsScreen";
import EnterLocalTransferBeneficiaryScreen from "./screens/EnterLocalTransferBeneficiaryScreen";
import InternalTransferCTCAndCTAScreen from "./screens/InternalTransferCTCAndCTAScreen";
import LocalTransferSuccessScreen from "./screens/LocalTransferSuccessScreen";
import TransferPaymentScreen from "./screens/TransferPaymentScreen";
import { AddBeneficiarySelectionType, Bank, Contact } from "./types";

export type InternalTransfersStackParams = {
  "Transfers.TrasnfersLandingScreen": undefined;
  "InternalTransfers.SendToBeneficiaryScreen": undefined;
  "InternalTransfers.EnterBeneficiaryDetailsScreen": undefined;
  "InternalTransfers.PaymentsHubScreen": undefined;
  "InternalTransfers.ConfirmNewBeneficiaryScreen": {
    bankName: string;
  };

  "InternalTransfers.InternalTransferScreen": {
    ResetForm?: boolean;
    inEditPhase?: boolean;
    fromLocalReviewScreen?: boolean;
    isActiveUser?: boolean;
  };
  "InternalTransfers.ReviewTransferScreen": undefined;
  "InternalTransfers.TransferSettingScreen": undefined;
  "InternalTransfers.BeneficiaryDeclarationModal": undefined;
  "InternalTransfers.ConfirmationScreen": undefined;
  "InternalTransfers.TermsAndConditionsModal": undefined;
  "InternalTransfers.StandardTransferNewBeneficiaryScreen": undefined;
  "InternalTransfers.QuickTransferScreen":
    | {
        PaymentAmount: number;
        ReasonCode: string;
        isActiveUser?: boolean;
      }
    | undefined;
  "InternalTransfers.EnterQuickTransferBeneficiaryScreen": undefined;
  "InternalTransfers.TransferPaymentScreen": undefined;
  "InternalTransfers.EnterLocalTransferBeneficiaryScreen": undefined;
  "InternalTransfers.LocalTransferBeneficiaryScreen": undefined;
  "InternalTransfers.GenerateQrScreen": undefined;
  "InternalTransfers.ConfirmLocalTransferBeneficiaryScreen": {
    PaymentAmount: number;
    isStandardFlow?: boolean;
    ReasonCode: string;
    Beneficiary: {
      FullName: string;
      Bank: Bank;
      SelectionType: AddBeneficiarySelectionType;
      SelectionValue: string;
      IBAN: string;
      type?: string;
      nickname?: string;
      beneficiaryId: string;
    };
  };
  "InternalTransfers.BeneficiaryProfileScreen": {
    isIvrFailed?: boolean;
  };
  "InternalTransfers.ReviewLocalTransferScreen": {
    PaymentAmount: number;
    ReasonCode: string;
    selectionType?: string;
    Beneficiary: {
      beneficiaryId: string;
      FullName: string;
      Bank?: Bank;
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
  "InternalTransfers.ActivateNewBeneficiaryScreen": {
    selectedType: string;
    isLocalBeneficiary: boolean;
    Beneficiary: {
      beneficiaryId: string;
      FullName: string;
      Bank: Bank;
      SelectionType?: AddBeneficiarySelectionType;
      SelectionValue?: string;
      IBAN: string;
      type?: string;
      nickname?: string;
    };
  };
  "InternalTransfers.IVRCheckScreen": undefined;
  "InternalTransfers.WaitingVerificationScreen": {
    navigationFlow: string;
  };
  "InternalTransfers.ViewTransactionScreen": undefined;
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
  "InternalTransfers.EditNickNameModalScreen": undefined;
  "InternalTransfers.LocalTransferSuccessScreen":
    | {
        transferAmount: number;
        beneficiaryName: string;
        clientTimestamp: unknown;
      }
    | undefined;
  "InternalTransfers.BeneficiaryListsWithSearchForTransfersScreen": undefined;
};

export const Stack = createNativeStackNavigator<InternalTransfersStackParams>();

export default function InternalTransfersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={TransfersLandingScreen} name="Transfers.TrasnfersLandingScreen" />
      <Stack.Screen component={InternalTransferScreen} name="InternalTransfers.InternalTransferScreen" />
      <Stack.Screen component={SendToBeneficiaryScreen} name="InternalTransfers.SendToBeneficiaryScreen" />
      <Stack.Screen component={ReviewTransferScreen} name="InternalTransfers.ReviewTransferScreen" />
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
        component={LocalTransferBeneficiaryScreen}
        name="InternalTransfers.LocalTransferBeneficiaryScreen"
      />
      <Stack.Screen
        component={ConfirmLocalTransferBeneficiaryScreen}
        name="InternalTransfers.ConfirmLocalTransferBeneficiaryScreen"
      />
      <Stack.Screen component={BeneficiaryProfileScreen} name="InternalTransfers.BeneficiaryProfileScreen" />
      <Stack.Screen component={ActivateNewBeneficiaryScreen} name="InternalTransfers.ActivateNewBeneficiaryScreen" />
      <Stack.Screen component={ReviewLocalTransferScreen} name="InternalTransfers.ReviewLocalTransferScreen" />
      <Stack.Screen component={QuickTransferSuccessScreen} name="InternalTransfers.QuickTransferSuccessScreen" />
      <Stack.Screen
        component={StandardTransferNewBeneficiaryScreen}
        name="InternalTransfers.StandardTransferNewBeneficiaryScreen"
      />
      <Stack.Screen component={IVRCheckScreen} name="InternalTransfers.IVRCheckScreen" />
      <Stack.Screen component={WaitingVerificationScreen} name="InternalTransfers.WaitingVerificationScreen" />
      <Stack.Screen component={ViewTransactionScreen} name="InternalTransfers.ViewTransactionScreen" />
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
      <Stack.Screen
        component={EditNickNameModalScreen}
        name="InternalTransfers.EditNickNameModalScreen"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen component={LocalTransferSuccessScreen} name="InternalTransfers.LocalTransferSuccessScreen" />
      <Stack.Screen
        options={{ presentation: "fullScreenModal" }}
        component={GenerateQrScreen}
        name="InternalTransfers.GenerateQrScreen"
      />
      <Stack.Screen
        component={BeneficiaryListsWithSearchForTransfersScreen}
        name="InternalTransfers.BeneficiaryListsWithSearchForTransfersScreen"
      />
    </Stack.Navigator>
  );
}
