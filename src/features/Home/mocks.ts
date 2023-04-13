import { QuickAction, Section } from "./types";

export const quickActionMocks: QuickAction[] = [
  {
    color: "complimentBase",
    icon: "AddBorderedIcon",
    title: "Add money",
    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
    type: "balance-add",
  },
  {
    color: "primaryBase-30",
    icon: "SplitIcon",
    title: "Split bill",
    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
    type: "split-bill",
  },
  {
    color: "complimentBase",
    icon: "SettingsIcon",
    title: "Settings",
    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
    type: "settings",
  },
  {
    color: "successBase",
    icon: "TransferVerticalIcon",
    title: "Send money",
    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
    type: "send-money",
  },
  {
    color: "primaryBase-30",
    icon: "ReferralIcon",
    title: "Send invite",
    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
    type: "referrals",
  },
  {
    color: "complimentBase",
    icon: "TransferHorizontalIcon",
    title: "Internal transfer",
    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
    type: "internal-transfer",
  },
];

export const sectionMocks: Section[] = [
  {
    title: "Quick Actions",
    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
    isSticky: true,
    type: "quick-actions",
  },
  {
    title: "Rewards",
    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
    isSticky: false,
    type: "rewards",
  },
  {
    title: "What's Next",
    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
    isSticky: false,
    type: "whats-next",
  },
  {
    title: "Section 4",
    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
    isSticky: false,
    type: "whats-next-2",
  },
  {
    title: "Section 5",
    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
    isSticky: false,
    type: "whats-next-3",
  },
];
