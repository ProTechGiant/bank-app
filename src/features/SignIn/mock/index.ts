import DeviceInfo from "react-native-device-info";

export const getMockData = (otp: string) => {
  if (otp.startsWith("1")) {
    return {
      errorContent: {
        Errors: [
          {
            ErrorId: "0030",
          },
        ],
      },
    };
  } else if (otp.startsWith("2")) {
    return {
      errorContent: {
        Errors: [
          {
            ErrorId: "0031",
          },
        ],
      },
    };
  } else if (otp.startsWith("3")) {
    return {
      errorContent: {
        Errors: [
          {
            ErrorId: "0032",
          },
        ],
      },
    };
  }
  return { Status: true };
};

export const getMockSignIn = (otp: string) => {
  if (otp.startsWith("1")) {
    return {
      errorContent: {
        Errors: [
          {
            ErrorId: "0011",
          },
        ],
      },
    };
  } else if (otp.startsWith("2")) {
    return {
      errorContent: {
        Errors: [
          {
            ErrorId: "0012",
          },
        ],
      },
    };
  } else if (otp.startsWith("3")) {
    return {
      errorContent: {
        Errors: [
          {
            ErrorId: "0009",
          },
        ],
      },
    };
  } else if (otp.startsWith("4")) {
    return {
      errorContent: {
        Errors: [
          {
            ErrorId: "0010",
          },
        ],
      },
    };
  }
  return {
    AccessToken: "ytXYfc4ibY8ZmwQsBPbgZiW1uTAeQyTA",
    RefreshToken: "9g3ZExZ39hyBgaK56xKris3iKtmuKcmytasCPRmA",
    IdToken:
      "eyJraWQiOiI0NTdDXzhvWnVWOURiM2FZTzZ4MVN2UjYtNmpjR2xGRF9rNHBuUjczTkxnIiwiYWxnIjoiUlMyNTYifQ.eyJydF9oYXNoIjoiSkVLZEV4VEQ5d01tMElSMUhJZ3FXZyIsImlhdCI6MTY5MzEzMzU0OCwiaXNzIjoiaHR0cHM6Ly9pc3ZhLXJwMS5hcHBzLmRldi1ub25wcm9kLWlzdmEubnBuYmFuay5sb2NhbCIsImF0X2hhc2giOiJpV1I2ZFBub1lDeEJVMGhlNkd5aFp3Iiwic3ViIjoidGVzdHVzZXIxIiwiZXhwIjoxNjkzMTM3MTQ4LCJhdWQiOiJ0UjJvWjJXWW9rbnhyWnhIbm5YcyJ9.c7buL_hEF2DKwPWyJFKq1y46mDeta098higmEmcixIL_9ZPPi90GXE0sG0OO_DDAJUFMYKBilk7O0m1Eujp1LS9VgwelO4nsDLH7m48Ru67LA1WrkNSfcNoRpNjJf6wG_eIcgNr8cvFdNILFFUg3YpaInZac-ZnDnlFh5cmPDV0CU6hO1MRldRuEBHE2iBpspvHBlFVSbmYeutLY5iDJb_2DQdh4vEu4hyKMeuBO1N5dy61Mtaq4hZHwXhju1QuLZKhNOEfaggBTn5W5VlSWeegCfFDF54pS0xX3BCbS_4JcXzD6OL721YWxCMkHQ5a21DMOCBw7zzdPZmfUp0F_TA",
    TokenType: "bearer",
  };
};

export const mockUserMatch = {
  TotalRecords: 1,
  isvauserId: "NTY3ODkzNDU3Ng",
  NationalId: "1234567890",
  AccountValid: true,
  UserName: "match",
  DeviceId: DeviceInfo.getDeviceId(),
  DeviceName: DeviceInfo.getDeviceName(),
  DeviceStatus: "R",
  MobileNumber: "+966599999999",
  CustomerId: "1032456745",
  CustomerName: "Ram Gupta",
  Email: "ram.gupta@email.com",
};

export const mockUserNotMatchDevice = {
  TotalRecords: 1,
  isvauserId: "NTY3ODkzNDU3Ng",
  NationalId: "1234567890",
  AccountValid: true,
  UserName: "match",
  DeviceId: DeviceInfo.getDeviceId() + 1,
  DeviceName: DeviceInfo.getDeviceName(),
  DeviceStatus: "R",
  MobileNumber: "+966599999999",
  CustomerId: "1032456745",
  CustomerName: "Ram Gupta",
  Email: "ram.gupta@email.com",
};

export const mockUserNotMatch = {
  TotalRecords: 0,
};
