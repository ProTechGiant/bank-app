import axios, { AxiosError, AxiosResponse } from "axios";

import { IqamaInputs } from "@/types/onboarding";
import { OrderCardValues } from "@/contexts/OrderCardContext";

export const orderCardEndPoint = "http://alpha-card-service.apps.development.projectcroatia.cloud/v1/cards";

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string, config?: {}) => axios.get<T>(url, config).then(responseBody),
  post: <T>(url: string, body: {}, config?: {}) => axios.post<T>(url, body, config).then(responseBody),
  put: <T>(url: string, body: {}, config?: {}) => axios.put<T>(url, body, config).then(responseBody),
  del: <T>(url: string, config?: {}) => axios.delete<T>(url, config).then(responseBody),
};

const Onboarding = {
  iqamaTahaq: (url: string, userIqama: IqamaInputs, config?: {}) => requests.post<IqamaInputs>(url, userIqama, config),
};

const OrderCard = {
  orderCard: async (endpoint: string, formValue: OrderCardValues, config?: {}) =>
    requests.post<OrderCardValues>(endpoint, formValue, config),
};

const agent = {
  requests,
  Onboarding,
  OrderCard,
};

export default agent;
