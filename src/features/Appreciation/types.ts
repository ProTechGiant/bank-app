export enum TabsTypes {
  ALL = "All",
  REDEEMED = "Redeemed",
  LIKED = "Liked",
}

export enum SortingOptions {
  RECOMMENDED = "recommendedForYou",
  MOST_RECENT = "mostRecent",
  EXPIRING_SOONEST = "expiringSoonest",
}

export interface FilterItemType {
  id: string;
  name: string;
  isActive: boolean;
}

export interface FiltersType {
  filterName: string;
  filters: FilterItemType[];
}
