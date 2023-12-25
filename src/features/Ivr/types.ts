export interface IvrWaitingScreenParams {
  onSuccess: () => void;
  onError: () => void;
  onBack: () => void;
  onApiCall: () => Promise<unknown>;
  varient: "screen" | "modal";
}
