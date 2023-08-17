export enum TabsTypes {
  ALL = "All",
  REDEEMED = "Redeemed",
}

export interface SortingOptionType {
  id: string;
  label: string;
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
