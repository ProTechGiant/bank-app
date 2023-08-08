import { AddMoneyStackParams } from "@/features/AddMoney/AddMoneyStack";
import { CardActionsStackParams } from "@/features/CardActions/CardActionsStack";
import { FrequentlyAskedQuestionsStackParams } from "@/features/FrequentlyAskedQuestions/FrequentlyAskedQuestionsStack";
import { HelpAndSupportStackParams } from "@/features/HelpAndSupport/HelpAndSupportStack";
import { HomeStackParams } from "@/features/Home/HomeStack";
import { InternalTransfersStackParams } from "@/features/InternalTransfers/InternalTransfersStack";
import { NotificationManagementStackParams } from "@/features/NotificationManagement/NotificationManagementStack";
import { PaymentDisputesStackParams } from "@/features/PaymentDisputes/PaymentDisputesStack";
import { ProfileDetailsStackParams } from "@/features/ProfileDetails/ProfileDetailsStack";
import { ReferralStackParams } from "@/features/Referral/ReferralStack";
import { SadadBillPaymentStackParams } from "@/features/SadadBillPayment/SadadBillPaymentStack";
import { SavingsGoalsStackParams } from "@/features/SavingsGoals/SavingsGoalsStack";
import { SettingsStackParams } from "@/features/Settings/SettingsStack";
import { StatmentsStackParams } from "@/features/Statements/StatementsStack";
import { TopSpendingStackParams } from "@/features/TopSpending/TopSpendingStack";
import { SingleTagType, TransactionDetailed } from "@/features/ViewTransactions/types";
import { ViewTransactionsStackParams } from "@/features/ViewTransactions/ViewTransactionsStack";
import { WhatsNextStackParams } from "@/features/WhatsNext/WhatsNextStack";

import { SignInStackParams } from "../features/SignIn/SignInStack";
import OneTimePasswordModalParams from "./one-time-password-modal-params";

type RootStackParams = {
  "ProxyAlias.ProxyAliasStack": undefined;
  "TopSpending.TopSpendingStack":
    | {
        screen: keyof TopSpendingStackParams;
        params?: {
          transactionTags: Array<SingleTagType>;
          transactionId: string;
        };
      }
    | undefined;
  "CardActions.CardActionsStack": {
    screen?: keyof CardActionsStackParams;
  };
  "Home.HomeStack":
    | {
        screen: keyof HomeStackParams;
      }
    | undefined;
  "AddMoney.AddMoneyStack":
    | {
        screen: keyof AddMoneyStackParams;
      }
    | undefined;
  "SadadBillPayments.SadadBillPaymentStack":
    | {
        screen: keyof SadadBillPaymentStackParams;
      }
    | undefined;
  "InternalTransfers.InternalTransfersStack":
    | {
        screen: keyof InternalTransfersStackParams;
      }
    | undefined;
  "Temporary.LandingScreen": undefined;
  "Temporary.DummyScreen": undefined;
  "Referral.ReferralStack": undefined;
  "SignIn.SignInStack": undefined;
  "Modal.QuickActionsReorderModal": undefined;
  "Modal.HomepageReorderModal": undefined;
  "NotificationManagement.NotificationManagementStack": undefined;
  "ViewTransactions.ViewTransactionsStack": {
    screen: string;
    params: {
      data: TransactionDetailed;
      cardId: string;
      createDisputeUserId: string;
    };
  };
  "Settings.SettingsStack": undefined;
  "SavingsGoals.SavingsGoalsStack": {
    savingsPotsNumber: number;
  };
  "Passcode.ChangePasscodeStack": undefined;
  "FrequentlyAskedQuestions.FrequentlyAskedQuestionsStack": undefined;
  "NotificationManagement.HubScreen": undefined;
  "NotificationManagement.CategoryScreen": { categoryId: string; title: string };
  "WhatsNext.WhatsNextStack": undefined;
  "HelpAndSupport.HelpAndSupportStack":
    | {
        screen: keyof HelpAndSupportStackParams;
      }
    | undefined;
  "OneTimePassword.OneTimePasswordModal": OneTimePasswordModalParams<AuthenticatedStackParams>;

  "PaymentDisputes.PaymentDisputesStack":
    | {
        screen: keyof PaymentDisputesStackParams;
      }
    | undefined;
  "ProfileDetails.ProfileDetailsStack": undefined;
  "Statements.StatementsStack": undefined;
};

type AuthenticatedStackParams = RootStackParams &
  TopSpendingStackParams &
  SavingsGoalsStackParams &
  ViewTransactionsStackParams &
  StatmentsStackParams &
  SadadBillPaymentStackParams &
  InternalTransfersStackParams &
  CardActionsStackParams &
  HomeStackParams &
  FrequentlyAskedQuestionsStackParams &
  WhatsNextStackParams &
  NotificationManagementStackParams &
  ReferralStackParams &
  PaymentDisputesStackParams &
  SignInStackParams &
  HelpAndSupportStackParams &
  SettingsStackParams &
  ProfileDetailsStackParams;

export default AuthenticatedStackParams;
