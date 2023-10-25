import { UploadDocumentStatus } from "../constants";
import { RequiredDocumentInterface } from "../types";

export const documentMock: RequiredDocumentInterface[] = [
  {
    DocumentGuid: "23",
    DescriptionEn:
      "this is a place holder text for document description where all information on how to get the document and the expiry date should be... ",
    Reason: "Not required",
    Name: "Document Title",
    DocumentStatus: UploadDocumentStatus.REJECTED,
  },
  {
    DocumentGuid: "24",
    DescriptionEn:
      "this is a place holder text for document description where all information on how to get the document and the expiry date should be... ",
    Name: "Document Title",
    DocumentStatus: UploadDocumentStatus.APPROVED,
  },
  {
    DocumentGuid: "25",
    DescriptionEn:
      "this is a place holder text for document description where all information on how to get the document and the expiry date should be... ",
    Name: "Title 3",
    DocumentStatus: UploadDocumentStatus.NEW,
  },
] as RequiredDocumentInterface[];
