import { FiltersType } from "@/features/Appreciation/types";

export const queryKeys = {
  all: () => ["content"] as const,
  filters: () => [...queryKeys.all(), "filters"] as const,
};

export function useFiltersList() {
  const MOCKED_FILTERS: FiltersType[] = [
    {
      filterName: "Category",
      filters: [
        { id: "1", name: "Film", isActive: false },
        { id: "2", name: "Music", isActive: false },
        { id: "3", name: "Fashion", isActive: false },
        { id: "4", name: "Sport", isActive: false },
        { id: "5", name: "Eating out", isActive: false },
        { id: "6", name: "Gaming", isActive: false },
        { id: "7", name: "Technology", isActive: false },
      ],
    },
    {
      filterName: "Location",
      filters: [
        { id: "1", name: "Riyadh", isActive: false },
        { id: "2", name: "Jeddah", isActive: false },
        { id: "3", name: "Everywhere", isActive: false },
      ],
    },
    {
      filterName: "Redeem",
      filters: [
        { id: "1", name: "in person", isActive: false },
        { id: "2", name: "Online", isActive: false },
      ],
    },
  ];

  return { data: MOCKED_FILTERS };
}
