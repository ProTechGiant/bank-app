import axios, { AxiosError, AxiosResponse } from "axios";

import { IqamaInputs } from "@/Axios/onboarding";
import { OrderCardValues } from "@/features/ApplyCards/context/OrderCardContext";
import { Account, Balance } from "@/types/account";
import { Notification } from "@/types/notification";

const responseBody = <T>(response: AxiosResponse<T>) => response.data;
const responseError = <T>(error: AxiosError<T>) => error.response;
const headers = { headers: { "X-API-KEY": "564c0148-56a1-11ed-9b6a-0242ac120002" } };
const baseUrlSL = `https://api-dev.apps.dev-dmz.projectcroatia.cloud`;

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

const SL = {
  account: async (endpoint: string) => await requests.get<Account[]>(baseUrlSL + endpoint, headers),
  balance: async (endpoint: string) => await requests.get<Balance[]>(baseUrlSL + endpoint, headers),
  notification: async (endpoint: string) => await requests.get<Notification[]>(baseUrlSL + endpoint, headers),
};

const agent = {
  requests,
  Onboarding,
  OrderCard,
  SL,
};

export default agent;
