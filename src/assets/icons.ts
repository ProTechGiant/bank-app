import { default as AddIcon } from "./icons/add.svg";
import { default as BackIcon } from "./icons/back.svg";
import { default as ChevronRightIcon } from "./icons/chevron-right.svg";
import { default as CloseIcon } from "./icons/close.svg";
import { DownArrowIcon } from "./icons/down-arrow-icon";
import { default as GlobeIcon } from "./icons/globe.svg";
import { default as InfoCircleIcon } from "./icons/info-circle.svg";
import { default as NotificationIcon } from "./icons/notification.svg";
import { default as SplitIcon } from "./icons/split.svg";
import { default as TransferIcon } from "./icons/transfer.svg";
import { UpArrowIcon } from "./icons/up-arrow-icon";

export const Icons = {
  Add: AddIcon,
  Split: SplitIcon,
  Transfer: TransferIcon,
  Globe: GlobeIcon,
  Close: CloseIcon,
  Back: BackIcon,
  Notification: NotificationIcon,
  DownArrow: DownArrowIcon,
  UpArrow: UpArrowIcon,
  ChevronRight: ChevronRightIcon,
  InfoCircle: InfoCircleIcon,
};

export type Icons = typeof Icons;
