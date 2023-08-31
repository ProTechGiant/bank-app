import { format } from "date-fns";

import { ChatEvent } from "../types";

export function formatUtcTimestampToTime(utcTimestamp: number) {
  const date = new Date(utcTimestamp);
  const formattedDate = format(date, "h:mm a");
  return formattedDate;
}

export const combineAndFilterMessages = (previousChatData: ChatEvent[], newMessages: ChatEvent[]): ChatEvent[] => {
  const existingMessageIndexes = new Set(previousChatData.map(message => message.Index));
  const filteredNewMessages = newMessages.filter(message => !existingMessageIndexes.has(message.Index));
  return [...filteredNewMessages, ...previousChatData];
};
