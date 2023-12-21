export interface IvrWaitingScreenParams {
  onSuccess: () => void;
  onError: () => void;
  apiPath: string;
  newPasscode: string;
  correlationId: string | undefined;
  isvaUserId?: string;
  flow?: "onboarding" | "signin" | "loggedin";
  workflowTask?: { Id: string; Name: string };
  mobileNumber?: string;
  nationalId?: string;
}

export interface IvrWaitingApiInputInterface {
  apiPath: string;
  correlationId?: string;
  passcode: string;
  mobileNumber?: string;
  nationalId?: string;
  isvaUserId?: string;
  workflowTask?: { Id: string; Name: string };
  flow?: "onboarding" | "signin" | "loggedin";
}
