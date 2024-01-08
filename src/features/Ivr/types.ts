export interface IvrWaitingScreenParams {
  onSuccess: (response) => void;
  onError?: () => void;
  onUnSuccessfull?: () => void;
  onBack: () => void;
  onApiCall: () => Promise<unknown>;
  handleOnIVRConfirm?: () => void;
  isIVRLoading?: boolean;
  varient: "screen" | "modal";
  handleOnCannotCreateErrorModal?: () => void;
}
