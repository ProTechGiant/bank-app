export interface FilterItemType {
  name: string;
  isActive: boolean;
}

interface AuthorSocialMediaType {
  Name: string;
  Link: string;
}

interface MediaType {
  SourceFileName: string;
  SourceFileDatatype: string;
  SourceFileURL: string;
}

export interface ArticleSectionType {
  ContentId: string;
  ParentContentId: string;
  ContentDataTypeId: string;
  ContentCategoryId: string;
  ContentTag: string;
  ContentPublishDateTime: string;
  Title: string;
  ContentDescription: string;
  Media: MediaType[];
  WhatsNextCategoryId: string;
  WhatsNextCategory: string;
  WhatsNextTypeId: string;
  WhatsNextType: string;
  AuthorSocialMedia: AuthorSocialMediaType[];
  ChildrenContents?: ArticleSectionType[];
}

interface WhatsNextDataType {
  articleSection: ArticleSectionType[];
  WhatsNextCategories: string[];
  WhatsNextTypes: string[];
}
