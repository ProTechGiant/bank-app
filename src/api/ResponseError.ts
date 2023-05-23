export default interface ResponseError {
  Code: string;
  Message: string;
  Errors: Array<{ Message: string; Path: string; ErrorId: string }>;
  TraceId: string;
}
