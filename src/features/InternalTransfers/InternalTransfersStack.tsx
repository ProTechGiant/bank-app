import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  AddNoteScreen,
  BeneficiaryDeclarationModal,
  ConfirmationScreen,
  ConfirmLocalTransferBeneficiaryScreen,
  ConfirmNewBeneficiaryScreen,
  EnterBeneficiaryDetailsScreen,
  EnterQuickTransferBeneficiaryScreen,
  InternalTransferScreen,
  IVRCheckScreen,
  QuickTransferScreen,
  QuickTransferSuccessScreen,
  ReviewLocalTransferScreen,
  ReviewTransferScreen,
  SendToBeneficiaryScreen,
  StandardTransferNewBeneficiaryScreen,
  StandardTransferScreen,
  TermsAndConditionsModal,
  WaitingVerificationScreen,
} from "./screens";
import { AddBeneficiarySelectionType, AddNoteParams, Bank } from "./types";

export type InternalTransfersStackParams = {
  "InternalTransfers.SendToBeneficiaryScreen": undefined;
  "InternalTransfers.EnterBeneficiaryDetailsScreen": undefined;
  "InternalTransfers.PaymentsHubScreen": undefined;
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
  "InternalTransfers.StandardTransferScreen":
    | {
        PaymentAmount?: number;
        ReasonCode?: string;
      }
    | undefined;
  "InternalTransfers.ConfirmLocalTransferBeneficiaryScreen": {
    PaymentAmount: number;
    ReasonCode: string;
    Beneficiary: {
      FullName: string;
      Bank: Bank;
      SelectionType: AddBeneficiarySelectionType;
      SelectionValue: string;
      IBAN: string;
      type?: string;
    };
  };
  "InternalTransfers.ReviewLocalTransferScreen": {
    PaymentAmount: number;
    ReasonCode: string;
    Beneficiary: {
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
};

export const Stack = createNativeStackNavigator<InternalTransfersStackParams>();

export default function InternalTransfersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
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
        component={ConfirmLocalTransferBeneficiaryScreen}
        name="InternalTransfers.ConfirmLocalTransferBeneficiaryScreen"
      />
      <Stack.Screen component={ReviewLocalTransferScreen} name="InternalTransfers.ReviewLocalTransferScreen" />
      <Stack.Screen component={QuickTransferSuccessScreen} name="InternalTransfers.QuickTransferSuccessScreen" />
      <Stack.Screen
        component={StandardTransferNewBeneficiaryScreen}
        name="InternalTransfers.StandardTransferNewBeneficiaryScreen"
      />
      <Stack.Screen component={IVRCheckScreen} name="InternalTransfers.IVRCheckScreen" />
      <Stack.Screen component={WaitingVerificationScreen} name="InternalTransfers.WaitingVerificationScreen" />
    </Stack.Navigator>
  );
}
