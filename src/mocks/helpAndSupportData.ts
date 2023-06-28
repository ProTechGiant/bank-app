import { Content } from "@/types/Content";

export const CALL_US = "CallUS"; //TODO: content tag value needs to be agreed on with BE
export const REPORT_FRAUD = "ReportFraud"; //TODO: content tag value needs to be agreed on with BE

export const mockHelpAndSupport: Content = {
  ContentId: "string",
  ParentContentId: "string",
  ContentDataTypeId: "string",
  ContentCategoryId: "string",
  ContentTag: "string",
  Version: "string",
  VersionDate: "2023-04-20",
  ContentPublishDateTime: "2023-04-20T09:41:28.448Z",
  Title: "string",
  SubTitle: "string",
  ContentDescription: "string",
  ProductCode: "string",
  ProductTitle: "string",
  Media: [
    {
      SourceFileName: "string",
      SourceFileDatatype: "Video",
      SourceFileURL: "string",
    },
  ],
  WhatsNextCategory: "string",
  WhatsNextType: "string",
  AuthorName: "string",
  AuthorAbout: "string",
  RewardsLink: "string",
  ReadDuration: 0,
  AuthorSocialMedia: [
    {
      Name: "string",
      Link: "string",
    },
  ],
  EventDetails: {
    EventDateTime: "2023-04-20T09:41:28.448Z",
    OpeningHours: "string",
    Location: "string",
    Website: "string",
    Price: 0,
  },
  ChildrenContents: [
    {
      ContentId: "string",
      ParentContentId: "string",
      ContentDataTypeId: "string",
      ContentCategoryId: "string",
      ContentTag: CALL_US,
      Version: "string",
      VersionDate: "2023-04-20",
      ContentPublishDateTime: "2023-04-20T09:41:28.448Z",
      Title: "string",
      SubTitle: "string",
      ContentDescription: "0114603333",
      ProductCode: "string",
      ProductTitle: "string",
      Media: [
        {
          SourceFileName: "string",
          SourceFileDatatype: "Video",
          SourceFileURL: "string",
        },
      ],
      WhatsNextCategory: "string",
      WhatsNextType: "string",
      AuthorName: "string",
      AuthorAbout: "string",
      RewardsLink: "string",
      ReadDuration: 0,
      AuthorSocialMedia: [
        {
          Name: "string",
          Link: "string",
        },
      ],
      EventDetails: {
        EventDateTime: "2023-04-20T09:41:28.448Z",
        OpeningHours: "string",
        Location: "string",
        Website: "string",
      },
    },
    {
      ContentId: "string",
      ParentContentId: "string",
      ContentDataTypeId: "string",
      ContentCategoryId: "string",
      ContentTag: REPORT_FRAUD,
      Version: "string",
      VersionDate: "2023-04-20",
      ContentPublishDateTime: "2023-04-20T09:41:28.448Z",
      Title: "string",
      SubTitle: "string",
      ContentDescription: "0114603333",
      ProductCode: "string",
      ProductTitle: "string",
      Media: [
        {
          SourceFileName: "string",
          SourceFileDatatype: "Video",
          SourceFileURL: "string",
        },
      ],
      WhatsNextCategory: "string",
      WhatsNextType: "string",
      AuthorName: "string",
      AuthorAbout: "string",
      RewardsLink: "string",
      ReadDuration: 0,
      AuthorSocialMedia: [
        {
          Name: "string",
          Link: "string",
        },
      ],
      EventDetails: {
        EventDateTime: "2023-04-20T09:41:28.448Z",
        OpeningHours: "string",
        Location: "string",
        Website: "string",
      },
    },
  ],
};
