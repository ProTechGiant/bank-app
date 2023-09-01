import { DocumentStatus } from "../constants";
import { DocumentInterface } from "../types";

export interface SectionListDataTypes {
  title: string;
  data: DocumentInterface[];
}

export const groupDocumentsByStatus = (documents: DocumentInterface[]): SectionListDataTypes[] => {
  const downloaded: DocumentInterface[] = documents.filter(d => d.Status === DocumentStatus.Downloaded);
  const nonDownloaded: DocumentInterface[] = documents.filter(d => d.Status !== DocumentStatus.Downloaded);
  const result: SectionListDataTypes[] = [];
  if (nonDownloaded.length) result.push({ title: "nonDownloaded", data: nonDownloaded });
  if (downloaded.length) result.push({ title: "Downloaded", data: downloaded });
  return result;
};
