import { PUSH, SMS } from "./constants";

export interface Categories {
  categoryId: string;
  categoryName: string;
  categoryDescription: string;
  subCategories: SubCategories[];
}

export interface SubCategories {
  subCategoryId: string;
  subCategoryName: string;
  subCategoryDescription: string;
  selectedChannels: SelectedChannels[];
}

export interface UpdatedSubCategories {
  subCategoryId: string;
  selectedChannels: SelectedChannels[];
}

export interface SelectedChannels {
  channelId: string;
  channelName: typeof PUSH | typeof SMS;
  isSelected: boolean;
}
