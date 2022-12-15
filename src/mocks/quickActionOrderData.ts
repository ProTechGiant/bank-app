export type ReorderItem = {
  key: string;
  label: string;
  active: boolean;
  description: string;
};

export const quickActionOrderData: ReorderItem[] = [
  {
    key: "top-up",
    label: "Top-up",
    active: true,
    description: "Lorem ipsum dolor sit amet,consectetuer adipiscing elit.",
  },
  {
    key: "splitbill",
    label: "Split bill",
    active: true,
    description: "Lorem ipsum dolor sit amet,consectetuer adipiscing elit.",
  },
  {
    key: "transfer",
    label: "Transfer",
    active: false,
    description: "Lorem ipsum dolor sit amet,consectetuer adipiscing elit.",
  },
];
