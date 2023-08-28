export interface SubOption {
  Id: string;
  Name: string;
}

export interface ChatEndParams {
  serviceName: string;
  secureKey: string;
  alias: string;
  chatId: string;
}

export interface ChatEndResponse {
  ChatEnded: boolean;
  StatusCode: number;
  Alias: string;
}

export interface ReasonCode {
  ReasonCode: string;
}

export interface SubOptionProps {
  SubOptionId: string;
}

export interface ReasonOptionIconLookupProps {
  [key: string]: React.ReactElement;
}

interface Reason {
  Id: string;
  Name: string;
  Description: string;
  SubOptions: SubOption[];
}

export interface ReasonsOptionData {
  Reasons: Reason[];
}

interface ParticipantInformation {
  Nickname: string;
  Type: string;
  ParticipantId: number;
}

interface MessageObject {
  From: ParticipantInformation;
  Index: number;
}

export interface ChatData {
  Messages: MessageObject[];
  ChatEnded: boolean;
  StatusCode: number;
  Alias: string;
  SecureKey: string;
  UserId: string;
  ChatId: string;
  NextPosition: number;
  Monitored: boolean;
}
