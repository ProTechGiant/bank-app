import { AddMoneyStackParams } from "@/features/AddMoney/AddMoneyStack";
import { AllInOneCardParams } from "@/features/AllInOneCard/AllInOneCardStack";
import { CurrenciesType } from "@/features/AllInOneCard/types";
import { CardActionsStackParams } from "@/features/CardActions/CardActionsStack";
import { DocumentsStackParams } from "@/features/Documents/DocumentsStack";
import { FrequentlyAskedQuestionsStackParams } from "@/features/FrequentlyAskedQuestions/FrequentlyAskedQuestionsStack";
import { GoalGetterStackParams } from "@/features/GoalGetter/GoalGetterStack";
import { GoldWalletStackParams } from "@/features/GoldWallet/GoldWalletStack";
import { HelpAndSupportStackParams } from "@/features/HelpAndSupport/HelpAndSupportStack";
import { HomeStackParams } from "@/features/Home/HomeStack";
import { BottomTabParamList } from "@/features/Home/HomeTabs";
import { HomeTabsScreens } from "@/features/Home/types";
import { InternalTransfersStackParams } from "@/features/InternalTransfers/InternalTransfersStack";
import { IpsStackParams } from "@/features/Ips/IpsStack";
import { IvrWaitingScreenParams } from "@/features/Ivr/types";
import { MutualFundStackParams } from "@/features/MutualFund/MutualFundStack";
import { NotificationManagementStackParams } from "@/features/NotificationManagement/NotificationManagementStack";
import { NotificationsStackParams } from "@/features/Notifications/NotificationsStack";
import { OpenBankingStackParams } from "@/features/OpenBanking/OpenBankingStack";
import { PaymentDisputesStackParams } from "@/features/PaymentDisputes/PaymentDisputesStack";
import { ProfileDetailsStackParams } from "@/features/ProfileDetails/ProfileDetailsStack";
import { ProxyAliasStackParams } from "@/features/ProxyAlias/ProxyAliasStack";
import { ReferralStackParams } from "@/features/Referral/ReferralStack";
import { SadadBillPaymentStackParams } from "@/features/SadadBillPayment/SadadBillPaymentStack";
import { SavingsGoalsStackParams } from "@/features/SavingsGoals/SavingsGoalsStack";
import { SettingsStackParams } from "@/features/Settings/SettingsStack";
import { StatementsStackParams } from "@/features/Statements/StatementsStack";
import { TopSpendingStackParams } from "@/features/TopSpending/TopSpendingStack";
import { SingleTagType, TransactionDetailed } from "@/features/ViewTransactions/types";
import { ViewTransactionsStackParams } from "@/features/ViewTransactions/ViewTransactionsStack";
import { ArticleSectionType } from "@/features/WhatsNext/types";
import { WhatsNextStackParams } from "@/features/WhatsNext/WhatsNextStack";

import { SignInStackParams } from "../features/SignIn/SignInStack";
import { AppreciationStackParams } from "./../features/Appreciation/AppreciationStack";
import OneTimePasswordModalParams from "./one-time-password-modal-params";

type RootStackParams = {
  "ProxyAlias.ProxyAliasStack": { screen: keyof ProxyAliasStackParams } | undefined;
  "OpenBanking.OpenBankingStack": { screen: keyof OpenBankingStackParams } | undefined;
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
  "Home.HomeTabs":
    | {
        screen: HomeTabsScreens;
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
  "GoalGetter.GoalGetterStack":
    | {
        screen: keyof GoalGetterStackParams;
      }
    | undefined;
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
  "Passcode.ChangePasscodeStack":
    | undefined
    | {
        screen: string;
        params: {
          type: string;
        };
      };
  "FrequentlyAskedQuestions.FrequentlyAskedQuestionsStack": undefined;
  "NotificationManagement.HubScreen": undefined;
  "NotificationManagement.CategoryScreen": { categoryId: string; title: string };
  "WhatsNext.WhatsNextStack":
    | {
        screen: keyof WhatsNextStackParams;
        params: {
          topTenArticlesData?: ArticleSectionType;
        };
      }
    | undefined;
  "Appreciation.AppreciationStack": AppreciationStackParams;
  "HelpAndSupport.HelpAndSupportStack":
    | {
        screen: keyof HelpAndSupportStackParams;
      }
    | undefined;
  "OneTimePassword.OneTimePasswordModal": OneTimePasswordModalParams<AuthenticatedStackParams>;
  "Ivr.IvrWaitingScreen": IvrWaitingScreenParams;

  "PaymentDisputes.PaymentDisputesStack":
    | {
        screen: keyof PaymentDisputesStackParams;
      }
    | undefined;
  "ProfileDetails.ProfileDetailsStack": undefined;
  "Statements.StatementsStack": undefined;
  "Documents.DocumentsStack": undefined;
  "MutualFund.MutualFundStack": undefined;
  "Notifications.NotificationsStack":
    | {
        screen: keyof NotificationsStackParams;
      }
    | undefined;
  "AllInOneCard.AllInOneCardStack":
    | {
        screen: keyof AllInOneCardParams;
        params?: {
          cardType: string;
          currency: CurrenciesType;
        };
      }
    | undefined;
  "GoldWallet.GoldWalletStack": GoldWalletStackParams;
  "Ips.IpsStack":
    | IpsStackParams
    | {
        screen: keyof IpsStackParams;
      }
    | undefined;
};

type AuthenticatedStackParams = RootStackParams &
  TopSpendingStackParams &
  SavingsGoalsStackParams &
  ViewTransactionsStackParams &
  StatementsStackParams &
  DocumentsStackParams &
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
  GoalGetterStackParams &
  ProfileDetailsStackParams &
  AppreciationStackParams &
  NotificationsStackParams &
  MutualFundStackParams &
  BottomTabParamList &
  GoldWalletStackParams &
  AllInOneCardParams;

export default AuthenticatedStackParams;
