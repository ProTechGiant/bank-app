import { StatementInterface } from "../types";

export const groupMonthlyStatementsByYear = (monthlyStatements: StatementInterface[]): SectionListDataTypes[] => {
  const groupedByYear: { [year: string]: StatementInterface[] } = {};
  const groupedData: SectionListDataTypes[] = [];

  for (const statement of monthlyStatements) {
    const year = statement.StatementGenerationDate.split("-")[0];
    if (!groupedByYear[year]) {
      groupedByYear[year] = [];
      groupedData.push({ title: year, data: groupedByYear[year] });
    }
    groupedByYear[year].push(statement);
  }

  return groupedData.sort((a, b) => b.title.localeCompare(a.title, undefined, { numeric: true }));
};

export interface SectionListDataTypes {
  title: string;
  data: StatementInterface[];
}
