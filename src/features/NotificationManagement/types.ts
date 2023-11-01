import { PUSH, SMS } from "./constants";

export interface Categories {
  CategoryId: string;
  CategoryName: string;
  CategoryDescription: string;
  SubCategories: SubCategories[];
}

export interface SubCategories {
  SubCategoryId: string;
  SubCategoryName: string;
  SubCategoryDescription: string;
  SelectedChannels: SelectedChannels[];
}

export interface UpdatedSubCategories {
  SubCategoryId: string;
  SelectedChannels: SelectedChannels[];
}

export interface SelectedChannels {
  ChannelId: string;
  ChannelName: typeof PUSH | typeof SMS;
  IsPreferred: boolean;
}
