import { ConnectedServicesStatus } from "../constants";
import { ConnectedServicesDataListInterface, ConsentDetailedInterface } from "../types";

export const getConnectedServicesMock = (): ConnectedServicesDataListInterface[] => {
  return [
    {
      ConsentId: "1",
      ConsentStatus: ConnectedServicesStatus.AUTHORIZED,
      TPPInfo: {
        TPPNameEnglish: "TPP 1 English",
        TPPNameArabic: "TPP 1 Arabic",
        TPPLogo: "logo1.png",
      },
      AccountsNumber: 3,
      CreationDateTime: "2023-01-15T09:00:00",
      ExpirationDateTime: "2023-12-31T23:59:59",
      LastDataSharedDateTime: "2023-09-20T14:30:00",
    },
    {
      ConsentId: "2",
      ConsentStatus: ConnectedServicesStatus.AUTHORIZED,
      TPPInfo: {
        TPPNameEnglish: "TPP 2 English",
        TPPNameArabic: "TPP 2 Arabic",
        TPPLogo: "logo2.png",
      },
      AccountsNumber: 2,
      CreationDateTime: "2023-03-10T14:45:00",
      ExpirationDateTime: "2023-11-30T23:59:59",
      LastDataSharedDateTime: "2023-07-05T16:15:00",
    },
    {
      ConsentId: "3",
      ConsentStatus: ConnectedServicesStatus.AUTHORIZED,
      TPPInfo: {
        TPPNameEnglish: "TPP 3 English",
        TPPNameArabic: "TPP 3 Arabic",
        TPPLogo: "logo3.png",
      },
      AccountsNumber: 1,
      CreationDateTime: "2023-05-22T10:30:00",
      ExpirationDateTime: "2023-10-15T23:59:59",
      LastDataSharedDateTime: "2023-09-10T08:45:00",
    },
    {
      ConsentId: "4",
      ConsentStatus: ConnectedServicesStatus.AUTHORIZED,
      TPPInfo: {
        TPPNameEnglish: "TPP 4 English",
        TPPNameArabic: "TPP 4 Arabic",
        TPPLogo: "logo4.png",
      },
      AccountsNumber: 4,
      CreationDateTime: "2023-07-08T16:20:00",
      ExpirationDateTime: "2024-01-31T23:59:59",
      LastDataSharedDateTime: "2023-10-12T12:10:00",
    },
    {
      ConsentId: "5",
      ConsentStatus: ConnectedServicesStatus.AUTHORIZED,
      TPPInfo: {
        TPPNameEnglish: "TPP 5 English",
        TPPNameArabic: "TPP 5 Arabic",
        TPPLogo: "logo5.png",
      },
      AccountsNumber: 2,
      CreationDateTime: "2023-09-14T11:15:00",
      ExpirationDateTime: "2023-12-31T23:59:59",
      LastDataSharedDateTime: "2023-10-25T09:55:00",
    },
    {
      ConsentId: "6",
      ConsentStatus: ConnectedServicesStatus.AUTHORIZED,
      TPPInfo: {
        TPPNameEnglish: "TPP 6 English",
        TPPNameArabic: "TPP 6 Arabic",
        TPPLogo: "logo6.png",
      },
      AccountsNumber: 3,
      CreationDateTime: "2023-01-05T08:30:00",
      ExpirationDateTime: "2023-10-31T23:59:59",
      LastDataSharedDateTime: "2023-08-18T15:40:00",
    },
    {
      ConsentId: "7",
      ConsentStatus: ConnectedServicesStatus.AUTHORIZED,
      TPPInfo: {
        TPPNameEnglish: "TPP 7 English",
        TPPNameArabic: "TPP 7 Arabic",
        TPPLogo: "logo7.png",
      },
      AccountsNumber: 1,
      CreationDateTime: "2023-04-17T12:55:00",
      ExpirationDateTime: "2023-09-30T23:59:59",
      LastDataSharedDateTime: "2023-09-05T10:25:00",
    },
    {
      ConsentId: "8",
      ConsentStatus: ConnectedServicesStatus.AUTHORIZED,
      TPPInfo: {
        TPPNameEnglish: "TPP 8 English",
        TPPNameArabic: "TPP 8 Arabic",
        TPPLogo: "logo8.png",
      },
      AccountsNumber: 5,
      CreationDateTime: "2023-06-29T09:40:00",
      ExpirationDateTime: "2023-12-31T23:59:59",
      LastDataSharedDateTime: "2023-10-28T13:20:00",
    },
    {
      ConsentId: "9",
      ConsentStatus: ConnectedServicesStatus.AUTHORIZED,
      TPPInfo: {
        TPPNameEnglish: "TPP 9 English",
        TPPNameArabic: "TPP 9 Arabic",
        TPPLogo: "logo9.png",
      },
      AccountsNumber: 2,
      CreationDateTime: "2023-08-12T14:25:00",
      ExpirationDateTime: "2024-01-15T23:59:59",
      LastDataSharedDateTime: "2023-10-02T11:50:00",
    },
    {
      ConsentId: "10",
      ConsentStatus: ConnectedServicesStatus.AUTHORIZED,
      TPPInfo: {
        TPPNameEnglish: "TPP 10 English",
        TPPNameArabic: "TPP 10 Arabic",
        TPPLogo: "logo10.png",
      },
      AccountsNumber: 3,
      CreationDateTime: "2023-02-25T13:10:00",
      ExpirationDateTime: "2023-12-31T23:59:59",
      LastDataSharedDateTime: "2023-08-05T17:30:00",
    },
    {
      ConsentId: "1",
      ConsentStatus: ConnectedServicesStatus.EXPIRED,
      TPPInfo: {
        TPPNameEnglish: "TPP 1 English",
        TPPNameArabic: "TPP 1 Arabic",
        TPPLogo: "logo1.png",
      },
      AccountsNumber: 3,
      CreationDateTime: "2023-01-15T09:00:00",
      ExpirationDateTime: "2023-12-31T23:59:59",
      LastDataSharedDateTime: "2023-09-20T14:30:00",
    },
    {
      ConsentId: "2",
      ConsentStatus: ConnectedServicesStatus.EXPIRED,
      TPPInfo: {
        TPPNameEnglish: "TPP 2 English",
        TPPNameArabic: "TPP 2 Arabic",
        TPPLogo: "logo2.png",
      },
      AccountsNumber: 2,
      CreationDateTime: "2023-03-10T14:45:00",
      ExpirationDateTime: "2023-11-30T23:59:59",
      LastDataSharedDateTime: "2023-07-05T16:15:00",
    },
    {
      ConsentId: "3",
      ConsentStatus: ConnectedServicesStatus.REJECTED,
      TPPInfo: {
        TPPNameEnglish: "TPP 3 English",
        TPPNameArabic: "TPP 3 Arabic",
        TPPLogo: "logo3.png",
      },
      AccountsNumber: 1,
      CreationDateTime: "2023-05-22T10:30:00",
      ExpirationDateTime: "2023-10-15T23:59:59",
      LastDataSharedDateTime: "2023-09-10T08:45:00",
    },
    {
      ConsentId: "4",
      ConsentStatus: ConnectedServicesStatus.EXPIRED,
      TPPInfo: {
        TPPNameEnglish: "TPP 4 English",
        TPPNameArabic: "TPP 4 Arabic",
        TPPLogo: "logo4.png",
      },
      AccountsNumber: 4,
      CreationDateTime: "2023-07-08T16:20:00",
      ExpirationDateTime: "2024-01-31T23:59:59",
      LastDataSharedDateTime: "2023-10-12T12:10:00",
    },
    {
      ConsentId: "5",
      ConsentStatus: ConnectedServicesStatus.REVOKED,
      TPPInfo: {
        TPPNameEnglish: "TPP 5 English",
        TPPNameArabic: "TPP 5 Arabic",
        TPPLogo: "logo5.png",
      },
      AccountsNumber: 2,
      CreationDateTime: "2023-09-14T11:15:00",
      ExpirationDateTime: "2023-12-31T23:59:59",
      LastDataSharedDateTime: "2023-10-25T09:55:00",
    },
    {
      ConsentId: "6",
      ConsentStatus: ConnectedServicesStatus.REJECTED,
      TPPInfo: {
        TPPNameEnglish: "TPP 6 English",
        TPPNameArabic: "TPP 6 Arabic",
        TPPLogo: "logo6.png",
      },
      AccountsNumber: 3,
      CreationDateTime: "2023-01-05T08:30:00",
      ExpirationDateTime: "2023-10-31T23:59:59",
      LastDataSharedDateTime: "2023-08-18T15:40:00",
    },
    {
      ConsentId: "7",
      ConsentStatus: ConnectedServicesStatus.REVOKED,
      TPPInfo: {
        TPPNameEnglish: "TPP 7 English",
        TPPNameArabic: "TPP 7 Arabic",
        TPPLogo: "logo7.png",
      },
      AccountsNumber: 1,
      CreationDateTime: "2023-04-17T12:55:00",
      ExpirationDateTime: "2023-09-30T23:59:59",
      LastDataSharedDateTime: "2023-09-05T10:25:00",
    },
    {
      ConsentId: "8",
      ConsentStatus: ConnectedServicesStatus.EXPIRED,
      TPPInfo: {
        TPPNameEnglish: "TPP 8 English",
        TPPNameArabic: "TPP 8 Arabic",
        TPPLogo: "logo8.png",
      },
      AccountsNumber: 5,
      CreationDateTime: "2023-06-29T09:40:00",
      ExpirationDateTime: "2023-12-31T23:59:59",
      LastDataSharedDateTime: "2023-10-28T13:20:00",
    },
    {
      ConsentId: "9",
      ConsentStatus: ConnectedServicesStatus.REVOKED,
      TPPInfo: {
        TPPNameEnglish: "TPP 9 English",
        TPPNameArabic: "TPP 9 Arabic",
        TPPLogo: "logo9.png",
      },
      AccountsNumber: 2,
      CreationDateTime: "2023-08-12T14:25:00",
      ExpirationDateTime: "2024-01-15T23:59:59",
      LastDataSharedDateTime: "2023-10-02T11:50:00",
    },
    {
      ConsentId: "10",
      ConsentStatus: ConnectedServicesStatus.EXPIRED,
      TPPInfo: {
        TPPNameEnglish: "TPP 10 English",
        TPPNameArabic: "TPP 10 Arabic",
        TPPLogo: "logo10.png",
      },
      AccountsNumber: 3,
      CreationDateTime: "2023-02-25T13:10:00",
      ExpirationDateTime: "2023-12-31T23:59:59",
      LastDataSharedDateTime: "2023-08-05T17:30:00",
    },
  ];
};

export const getMockTppList = () => {
  return [
    {
      TPPId: "9e905cb587f0d5c791659097485127bb",
      TPPNameEnglish: "LG TPP Simulator App",
      TPPNameArabic: "محاكي الطرف الثالث",
    },
    {
      TPPId: "0c424057383883d8a5be5f32904d685d",
      TPPNameEnglish: "NeoTek",
      TPPNameArabic: "نيوتيك",
    },
    {
      TPPId: "efc75d51150675cc1d4513107bab958f",
      TPPNameEnglish: "OIDC Conformance Client App 1",
      TPPNameArabic: "OIDC Conformance Client App1",
    },
    {
      TPPId: "76dda4c9f7761c24bab654fcfa6753f1",
      TPPNameEnglish: "OIDC Conformance Client App 2",
      TPPNameArabic: "OIDC Conformance Client App 2",
    },
    {
      TPPId: "2c2053cae8982bca8c09c457df314baf",
      TPPNameEnglish: "TPP Simulator",
      TPPNameArabic: "محاكي الطرف الثالث",
    },
  ];
};

export const consetntDetailed: ConsentDetailedInterface = {
  ConsentId: "37723632420474186464855715465",
  TPPInfo: {
    TPPNameEnglish: "Darahem",
    TPPNameArabic: "دراهم",
    TPPNickName: "My TPP",
    GroupsListData: [
      {
        DataGroupNameEnglish: "Your account details",
        DataGroupNameArabic: "المعلومات الشخصية",
        PermissionsList: [
          {
            PermissionDescriptionEnglish:
              "The name of the account and the full legal name(s) of all parties.\nOptionally this can also include their address or addresses, telephone",
            PermissionDescriptionArabic: "اسم ومعلومات صاحب الحساب والعنوان البريدي",
          },
          {
            PermissionDescriptionEnglish:
              "The name of the account and your full legal name.\nOptionally this can also include your address, telephone numbers and email",
            PermissionDescriptionArabic: "اسم الحساب والاسم الكامل لصاحب الحساب، بالإضافة إلى العنوان البريدي",
          },
        ],
      },
      {
        DataGroupNameEnglish: "Your account transactions",
        DataGroupNameArabic: "بيانات عمليات الحولات",
        PermissionsList: [
          {
            PermissionDescriptionEnglish: "Transactions you have set up",
            PermissionDescriptionArabic: "الحولات",
          },
        ],
      },
      {
        DataGroupNameEnglish: "Your Regular Payments",
        DataGroupNameArabic: "بيانات عمليات المدفوعات",
        PermissionsList: [
          {
            PermissionDescriptionEnglish: "Payee agreements you have set up",
            PermissionDescriptionArabic: "اسماء المعرفيين والمستفيدين بحسابك",
          },
        ],
      },
    ],
    CreationDateTime: "2023-09-18T11:07:11.677+03:00",
    ExiprationDateTime: "2024-06-30T13:40:00.000+03:00",
    Accounts: [
      {
        Id: 1265485126,
        Type: "Current Account",
      },
      {
        Id: 1265485324,
        Type: "Savings Account",
      },
    ],
    Cards: [
      {
        AccountNumber: "0003332220000000023",
        Type: "Debit",
      },
      {
        AccountNumber: "0003332220000000022",
        Type: "Credit",
      },
    ],
  },
};
