import { useQuery } from "react-query";

import { StatementTypes } from "../constants";
import { getMockStatments } from "../mocks/AccessStatementData";
import { PaginationInterface } from "../types";

export function useGetCustomerStatements(pagination: PaginationInterface, _statement: StatementTypes) {
  return useQuery(["accessStatments", pagination], () => {
    return getMockStatments(pagination);
  });
}
