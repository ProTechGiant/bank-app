import { SortingOptionType } from "./types";

export const AppreciationList = [
  {
    isNew: true,
    isRelatedToPlus: true,
    isTrending: true,
    title: "Andy Pitcher",
    date: "09/09/2023 . 20:00",
    location: "Riyadh",
    endsAt: "02/02/2023",
    promotedDescription: "Don’t miss the chance to hear DJ Max and his new album ‘Rock the stage’. ",
  },
  {
    isNew: true,
    isRelatedToPlus: false,
    isTrending: false,
    title: "Andy Pitcher",
    date: "09/09/2023 . 20:00",
    location: "Riyadh",
    endsAt: "02/02/2023",
  },
  {
    isNew: true,
    isRelatedToPlus: false,
    isTrending: true,
    title: "Andy Pitcher",
    date: "09/09/2023 . 20:00",
    location: "Riyadh",
    endsAt: "02/02/2023",
  },
];

export const SORTING_OPTIONS: SortingOptionType[] = [
  { id: "1", label: "Recommended for you" },
  { id: "2", label: "Most Recent" },
  { id: "3", label: "Expiring soonest" },
];
