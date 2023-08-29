import { StatementStatus } from "../constants";
import { StatementInterface } from "../types";

export const groupMonthlyStatementsByYear = (monthlyStatements: StatementInterface[]): SectionListDataTypes[] => {
  const groupedByYear: { [year: string]: StatementInterface[] } = {};
  const groupedData: SectionListDataTypes[] = [];

  for (const statement of monthlyStatements) {
    const year = statement.StatementGenerationDate?.split("-")[0];
    if (year) {
      if (!groupedByYear[year]) {
        groupedByYear[year] = [];
        groupedData.push({ title: year, data: groupedByYear[year] });
      }
      groupedByYear[year].push(statement);
    }
  }

  return groupedData.length
    ? groupedData.sort((a, b) => b.title.localeCompare(a.title, undefined, { numeric: true }))
    : [];
};

export interface SectionListDataTypes {
  title: string;
  data: StatementInterface[];
}

export const groupCustomStatementsByStatus = (monthlyStatements: StatementInterface[]): SectionListDataTypes[] => {
  const downloaded: StatementInterface[] = [];
  const nonDownloaded: StatementInterface[] = [];
  monthlyStatements.forEach(statement => {
    if (statement.Status === StatementStatus.DOWNLOADED) downloaded.push(statement);
    else nonDownloaded.push(statement);
  });
  const result: SectionListDataTypes[] = [];
  if (nonDownloaded.length) result.push({ title: "nonDownloaded", data: nonDownloaded });
  if (downloaded.length) result.push({ title: "Downloaded", data: downloaded });
  return result;
};
