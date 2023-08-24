export interface ChatEndParams {
  serviceName: string;
  secureKey: string;
  alias: string;
  chatId: string;
}

export interface ChatEndResponse {
  message: [] | null;
  chatEnded: boolean | null;
  statusCode: number;
  alias: string | null;
  secureKey: string | null;
  userId: string | null;
}
