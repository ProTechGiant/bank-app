import { SortingOptions } from "./types";

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

export const SORTING_OPTIONS_ALL_TAB: SortingOptions[] = [
  SortingOptions.RECOMMENDED,
  SortingOptions.MOST_RECENT,
  SortingOptions.EXPIRING_SOONEST,
];

export const SORTING_OPTIONS_OTHER_TABS: SortingOptions[] = [
  SortingOptions.MOST_RECENT,
  SortingOptions.EXPIRING_SOONEST,
];
