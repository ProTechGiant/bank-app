export default class ApiError<TError = unknown> extends Error {
  public statusCode: number;
  public errorContent: TError | undefined;

  public constructor(message: string, statusCode: number, errorContent?: TError) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);

    this.statusCode = statusCode;
    this.errorContent = errorContent;
  }
}
