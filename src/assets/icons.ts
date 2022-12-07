import { default as AddIcon } from "./icons/add.svg";
import { default as BackIcon } from "./icons/back.svg";
import { default as CloseIcon } from "./icons/close.svg";
import { default as DownArrowIcon } from "./icons/downArrow.svg";
import { default as GlobeIcon } from "./icons/globe.svg";
import { default as NotificationIcon } from "./icons/notification.svg";
import { default as SplitIcon } from "./icons/split.svg";
import { default as TransferIcon } from "./icons/transfer.svg";
import { default as UpArrowIcon } from "./icons/upArrow.svg";

export const Icons = {
  Add: AddIcon,
  Split: SplitIcon,
  Transfer: TransferIcon,
  Globe: GlobeIcon,
  Close: CloseIcon,
  Back: BackIcon,
  Notification: NotificationIcon,
  DownArrow: DownArrowIcon,
  upArrow: UpArrowIcon,
};

export type Icons = typeof Icons;
