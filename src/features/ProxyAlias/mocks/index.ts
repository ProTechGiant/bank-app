export const aliasCardType = {
  MOBILE_NUMBER: "MSISDN",
  NATIONAL_ID: "NATID",
  EMAIL: "EMAIL",
};

export const userProxies = [
  {
    ProxyType: "MSISDN",
    ProxyValue: "99966500000000",
    RegistrationId: "efbc24c5-4f2e-4730-aaaa-2cc4dfa59b41",
    ARBProxyFlag: false,
  },
  {
    ProxyType: "NATID",
    ProxyValue: "1234567890",
    RegistrationId: "efbc24c5-4f2e-4730-ffff-2cc4dfa59b41",
    ARBProxyFlag: true,
  },
  {
    ProxyType: "EMAIL",
    ProxyValue: "email@email.com",
    RegistrationId: "",
    ARBProxyFlag: false,
  },
];

export enum reasonOTP {
  LINK_ALIAS = "link-proxy-alias",
  OPT_OUT = "optout-proxy-alias",
  REGISTER_EMAIL = "register-email",
}

export enum aliasTypeCode {
  MSISDN = 1,
  NATID = 2,
  EMAIL = 3,
}
