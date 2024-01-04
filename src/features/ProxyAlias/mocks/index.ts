export const aliasCardType = {
  MOBILE_NUMBER: "MSISDN",
  NATIONAL_ID: "NATID",
  EMAIL: "EMAIL",
};

export const userProxies = [
  {
    ProxyType: "MSISDN",
    ProxyValue: "99966500000000",
    RegistrationId: "",
    ARBProxyFlag: false,
  },
  {
    ProxyType: "NATID",
    ProxyValue: "1234567890",
    RegistrationId: "",
    ARBProxyFlag: true,
    ARBMaskedIBAN: "XXXX 5467",
  },
  {
    ProxyType: "EMAIL",
    ProxyValue: "email@email.com",
    RegistrationId: "",
    ARBProxyFlag: false,
  },
];

export const userProxiesMocks = {
  UserName: {
    FirstName: "Ahmad ",
    SecondName: "Mahmoud",
    LastName: "Ammoura",
  },
  AccountNumber: "jkdssnw4rhiu4",
  UserProxies: userProxies,
};

export enum reasonOTP {
  LINK_ALIAS = "link-proxy-alias",
  OPT_OUT = "optout-proxy-alias",
  REGISTER_EMAIL = "register-email",
  // TODO : add new reason for UNLINK_ALIAS
}

export enum aliasTypeCode {
  MSISDN = "MSISDN",
  NATID = "NATID",
  EMAIL = "EMAIL",
}
