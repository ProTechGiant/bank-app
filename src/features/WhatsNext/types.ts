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

export interface EventDetails {
  EventDateTime: string;
  OpeningHours: string;
  Location: string;
  Website: string;
  Price: number;
}

export interface ArticleSectionType {
  ContentId: string;
  ParentContentId: string;
  ContentDataTypeId: string;
  ContentCategoryId: string;
  ContentTag: string;
  ContentPublishDateTime: string;
  Title: string;
  SubTitle: string;
  ContentDescription: string;
  Media: MediaType[];
  WhatsNextCategoryId: string;
  WhatsNextCategory: string;
  WhatsNextTypeId: string;
  WhatsNextType: string;
  AuthorName: string;
  AuthorAbout: string;
  AuthorSocialMedia: AuthorSocialMediaType;
  EventDetails: EventDetails;
  ChildrenContents?: ArticleSectionType[];
}

interface WhatsNextDataType {
  articleSection: ArticleSectionType[];
  WhatsNextCategories: string[];
  WhatsNextTypes: string[];
}
