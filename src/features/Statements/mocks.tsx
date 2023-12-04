import { StatementLanguageTypes, StatementStatus } from "./constants";
import { StatementInterface } from "./types";

const mockStatements: StatementInterface[] = [
  {
    CBSReferenceNumber: "ABC123",
    DocumentId: "123456789",
    Status: StatementStatus.GENERATED,
    StatementLanguage: StatementLanguageTypes.English,
    StatementStartDate: "2023-01-01",
    StatementEndDate: "2023-01-31",
    StatementGenerationDate: "2023-02-01",
    StatementRequestId: "REQ789",
  },
  {
    CBSReferenceNumber: "DEF456",
    DocumentId: "987654321",
    Status: StatementStatus.FAILED,
    StatementLanguage: StatementLanguageTypes.Arabic,
    StatementStartDate: "2023-02-01",
    StatementEndDate: "2023-02-28",
    StatementGenerationDate: "2023-03-01",
    StatementRequestId: "REQ987",
  },
  // Add more mock statements as needed
];

export default mockStatements;
