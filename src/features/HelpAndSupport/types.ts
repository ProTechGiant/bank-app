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

export interface AwaitTimeData {
  Ewt: number;
  Size: number;
  Calls: number;
  Pos: number;
  Aqt: number;
  Wpos: number;
  Clc: string;
  Wcalls: number;
}

export interface Party {
  Nickname: string;
  ParticipantId: number;
  Type: "Agent" | "Client" | "External";
}

interface EventAttributes {
  "general-properties": {
    "reason-for-leave"?: "TRANSFER" | "HOLD";
  };
}

export interface ChatEvent {
  From: Party;
  Index: number;
  Text: string;
  MessageType?: string;
  Type:
    | "ParticipantJoined"
    | "ParticipantLeft"
    | "Message"
    | "TypingStarted"
    | "TypingStopped"
    | "NicknameUpdated"
    | "PushUrl"
    | "FileUploaded"
    | "FileDeleted"
    | "CustomNotice"
    | "Notice"
    | "IdleAlert"
    | "IdleClose";
  UtcTime: number;
  UserData?: Record<string, string>;
  EventAttributes?: EventAttributes;
}

export interface ChatResponse {
  StatusCode: 0 | 1 | 2;
  Alias?: string;
  ChatEnded: boolean;
  ChatId: string;
  Messages: ChatEvent[];
  NextPosition: number;
  SecureKey: string;
  UserId: string;
  Monitored: boolean;
  InteractionId: number;
}
