export default interface ApiOnboardingError {
  Code?: string;
  Message?: string;
  Errors?: Array<{ Message: string; Path: string; ErrorId: string; ErrorCode: string }>;
  TraceId?: string;
}
