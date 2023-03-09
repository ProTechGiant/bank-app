import { QuickAction, Section } from "./types";

export const quickActionMocks: QuickAction[] = [
  {
    color: "complimentBase",
    icon: "AddBorderedIcon",
    title: "Balance add",
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
    color: "successBase",
    icon: "TransferVertical",
    title: "Send money",
    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
    type: "send-money",
  },
  {
    color: "complimentBase",
    icon: "SettingsIcon",
    title: "Settings",
    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
    type: "settings",
  },
  {
    color: "primaryBase-30",
    icon: "ReferralIcon",
    title: "Send invite",
    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
    type: "referrals",
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
