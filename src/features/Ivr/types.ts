export interface IvrWaitingScreenParams {
  onSuccess: () => void;
  onError: () => void;
  onBack: () => void;
  onApiCall: () => Promise<void>;
  varient: "screen" | "modal";
}
