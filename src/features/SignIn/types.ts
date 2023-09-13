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
}

export interface SigninType {
  AccessToken: string;
  ExpiresIn: number;
  TokenType: string;
  MobileNumber: string;
  NationalOrIqamaId: string;
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

export interface RegistrationResponse {
  Status: boolean;
}

export interface CheckUserStatusResponse {
  UserStatus: "active" | "temporary-blocked" | "permanently-blocked";
}
