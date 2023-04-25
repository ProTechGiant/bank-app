export interface Content {
  ContentId: string;
  ParentContentId: string;
  ContentDataTypeId: string;
  ContentCategoryId: string;
  ContentTag: string;
  Version: string;
  VersionDate: string;
  ContentPublishDateTime: string;
  Title: string;
  SubTitle: string;
  ContentDescription: string;
  ProductCode: string;
  ProductTitle: string;
  Media: {
    SourceFileName: string;
    SourceFileDatatype: string;
    SourceFileURL: string;
  }[];
  WhatsNextCategory: string;
  WhatsNextType: string;
  AuthorName: string;
  AuthorAbout: string;
  RewardsLink: string;
  ReadDuration: 0;
  AuthorSocialMedia: {
    Name: string;
    Link: string;
  }[];
  EventDetails: {
    EventDateTime: string;
    OpeningHours: string;
    Location: string;
    Website: string;
    Price: 0;
  };
  ChildrenContents: {
    ContentId: string;
    ParentContentId: string;
    ContentDataTypeId: string;
    ContentCategoryId: string;
    ContentTag: string;
    Version: string;
    VersionDate: string;
    ContentPublishDateTime: string;
    Title: string;
    SubTitle: string;
    ContentDescription: string;
    ProductCode: string;
    ProductTitle: string;
    Media: [
      {
        SourceFileName: string;
        SourceFileDatatype: string;
        SourceFileURL: string;
      }
    ];
    WhatsNextCategory: string;
    WhatsNextType: string;
    AuthorName: string;
    AuthorAbout: string;
    RewardsLink: string;
    ReadDuration: 0;
    AuthorSocialMedia: [
      {
        Name: string;
        Link: string;
      }
    ];
    EventDetails: {
      EventDateTime: string;
      OpeningHours: string;
      Location: string;
      Website: string;
    };
  }[];
}

export interface ContentCategories {
  CategoryId: string;
  CategoryName: string;
  CategoryDescription: string;
  CategoryLevel: number;
  ParentCategoryLevel: string;
}
