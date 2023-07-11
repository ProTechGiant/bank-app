import { useMutation, useQuery, useQueryClient } from "react-query";

import sendApiRequest from "@/api";
// import api from "@/api";
import { useCurrentAccount } from "@/hooks/use-accounts";
import { generateRandomId } from "@/utils";

interface Category {
  categoryId: number;
  categoryName: string;
  iconPath: string;
}

interface ApiCategoriesResponse {
  totalPages: number;
  totalSize: number;
  categories: Category[];
}

// *TODO here i do not use the custom api until the apis is completed
export default function usePredefinedCategories() {
  const account = useCurrentAccount();
  const account_id = account.data?.id;

  const categoriesQuery = useQuery<ApiCategoriesResponse, Error>(
    ["categories", account_id],
    () =>
      fetch(
        `http://alpha-transaction-service.apps.development.projectcroatia.cloud/v1/accounts/${account_id}/categories/predefined-categories?pageSize=1000&pageNumber=0`,
        {
          headers: {
            Accept: "application/json",
            "x-correlation-id": generateRandomId(),
            UserId: "301", // replace with appropriate user id
          },
        }
      ).then(res => res.json()),
    {
      // set staleTime to 10 seconds for caching
      staleTime: 10000,
      // enabled only if account_id exists
      enabled: !!account_id,
    }
  );

  return { categories: categoriesQuery.data };
}

// *TODO here i do not use the custom api until the apis is completed
export function useUpdateCategory() {
  const account = useCurrentAccount();
  const accountId = account.data?.id;
  const queryClient = useQueryClient();

  const mutation = useMutation(
    ({ transactionIds, newCategoryId, merchantName, oldCategoryId }: any) =>
      fetch(
        `http://alpha-transaction-service.apps.development.projectcroatia.cloud/v1/accounts/${accountId}/transactions/${transactionIds}?newCategoryId=${newCategoryId}&merchantName=${merchantName}&oldCategoryId=${oldCategoryId}&pageSize=1000&pageNumber=0`,
        {
          method: "PUT", // HTTP method, adjust as needed
          headers: {
            Accept: "application/json",
            "x-correlation-id": generateRandomId(),
            UserId: "301", // replace with appropriate user id
          },
        }
      ).then(res => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      }),
    {
      onSuccess: () => {
        // Refetch queries to update the local data
        queryClient.invalidateQueries("transactions");
      },
    }
  );

  return mutation;
}

export function useExcludeFromSummary() {
  const account = useCurrentAccount();

  const account_id = account.data?.id;

  return useMutation(async (data: { transactionId: string; hiddenFlag: boolean }) => {
    return sendApiRequest<void>(
      "v1",
      `accounts/${account_id}/transactions/${data.transactionId}`,
      "PUT",
      {
        PageSize: 1000,
        PageNumber: 0,
        hiddenFlag: data.hiddenFlag ? "Y" : "N",
      },
      undefined,
      {
        ["x-correlation-id"]: generateRandomId(),
      }
    );
  });
}
