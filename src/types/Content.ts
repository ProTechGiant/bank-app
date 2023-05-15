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

interface SubType {
  Id: string;
  Name: string;
}

export interface Content {
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
  ChildrenContents?: Content[];
  WhatsNextCategories?: SubType[];
  WhatsNextTypes?: SubType[];
}

export interface Feedback {
  ContentId: string;
  CustomerId: string;
  VoteId: string | null;
  VoteDescription: string;
  UpdatedOn: string;
}

export interface FeedbackRequest {
  ContentId: string;
  VoteId: string | null;
}

export interface Article {
  SingleArticle: Content;
  RelatedArticles: Content[];
  Feedback: Feedback;
}

export interface ContentCategories {
  CategoryId: string;
  CategoryName: string;
  CategoryDescription: string;
  CategoryLevel: number;
  ParentCategoryLevel: string;
}
