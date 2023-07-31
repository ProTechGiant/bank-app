export interface Category {
  CategoryId: string;
  CategoryName: string;
  CategoryDescription: string;
  CategoryLevel: number;
  ParentCategoryId: string;
  ImageUrl: string;
  Selected: boolean;
}
export interface SelectedCategory {
  CategoryId: string;
}
