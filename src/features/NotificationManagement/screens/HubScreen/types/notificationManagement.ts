interface SubCategories {
  subCategoryId: string;
  subCategoryName: string;
  subCategoryDescription: string;
  selectedChannels: SelectedChannels[];
}

interface SelectedChannels {
  channelId: string;
  channelName: string;
}

interface Categories {
  categoryId: string;
  categoryName: string;
  categoryDescription: string;
  subCategories: SubCategories[];
}

export interface NotificationCategoriesData {
  categories: Categories[];
}
