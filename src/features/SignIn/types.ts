import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import { AlertVariantType } from "@/components/Alert";

export interface ErrorMessageType {
  title?: string;
  modalMessage?: string;
  message?: string | JSX.Element;
  icon?: React.ReactElement<SvgProps | IconProps>;
  variant?: AlertVariantType;
  link?: string;
}

export interface IqamaInputs {
  MobileNumber: string;
  NationalId: string;
}

export interface LogInOtpChallengeParams {
  OneTimePassword: LogInOneTimePasswordParams;
}

interface LogInOneTimePasswordParams {
  Length: number;
  TimeToLive: number;
  AllowedAttempts: number;
}

export interface LoginUserType {
  AccessToken: string;
  RefreshToken: string;
  IdToken: string;
  TokenType: string;
  ExpiresIn?: number;
}

export interface ValidateDeviceType {
  SameDevice: boolean;
}

export interface RegistrationInputs {
  PassCode: string;
  NationalOrIqamaId: string;
  MobileNumber: string;
  Language: string;
}

export interface RequestNumberResponseType {
  Header: { StatusCode: string; RequestID: string; StatusDescription: string };
  Body: { transId: string; random: string };
}

export interface RegistrationResponse {
  Status: boolean;
}

export interface CheckUserStatusResponse {
  UserStatus: "active" | "temporary-blocked" | "permanently-blocked";
}

export interface UserType {
  TotalRecords: number;
  IsvaUserId: string;
  NationalId: string;
  AccountValid: boolean;
  UserName: string;
  DeviceId: string;
  DeviceName: string;
  DeviceStatus: string;
  MobileNumber: string;
  CustomerId: string;
  CustomerName: string;
  Email: string;
  isDeviceRegistered: boolean;
}

export enum StatusTypes {
  ACTIVE = 1,
  TEMPORARILY_BLOCKED = 2,
  PERMANENTLY_BLOCKED = 3,
  PANIC_MODE = 4,
}
export interface CheckCustomerStatusResponse {
  StatusId: StatusTypes;
  LastModifiedTime: string;
}
