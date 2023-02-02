import * as icons from "@/assets/icons";

export type ReorderItem = {
  key: string;
  label: string;
  active: boolean;
  description: string;
};
export interface quickActionReorderItem extends ReorderItem {
  icon: keyof typeof icons;
}

export const quickActionOrderData: quickActionReorderItem[] = [
  {
    key: "add",
    label: "Top-up",
    active: true,
    description: "Lorem ipsum dolor sit amet,consectetuer adipiscing elit.",
    icon: "AddIcon",
  },
  {
    key: "split",
    label: "Split bill",
    active: false,
    description: "Lorem ipsum dolor sit amet,consectetuer adipiscing elit.",
    icon: "SplitIcon",
  },
  {
    key: "transfer",
    label: "Transfer",
    active: true,
    description: "Lorem ipsum dolor sit amet,consectetuer adipiscing elit.",
    icon: "TransferIcon",
  },
  {
    key: "settings",
    label: "Settings",
    active: true,
    description: "Lorem ipsum dolor sit amet,consectetuer adipiscing elit.",
    icon: "SettingsIcon",
  },
  {
    key: "referrals",
    label: "Send invite",
    active: false,
    description: "Lorem ipsum dolor sit amet,consectetuer adipiscing elit.",
    icon: "ReferralIcon",
  },
];

export const homepageOrderData: ReorderItem[] = [
  {
    key: "quickactions",
    label: "Quick Actions",
    active: true,
    description: "Lorem ipsum dolor sit amet,consectetuer adipiscing elit.",
  },
  {
    key: "rewards",
    label: "Rewards",
    active: true,
    description: "Lorem ipsum dolor sit amet,consectetuer adipiscing elit.",
  },
  {
    key: "whatsnext",
    label: "What's Next",
    active: false,
    description: "Lorem ipsum dolor sit amet,consectetuer adipiscing elit.",
  },
];
