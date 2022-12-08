import axios, { AxiosError, AxiosResponse } from "axios";

import { IqamaInputs } from "@/types/onboarding";

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

const agent = {
  requests,
  Onboarding,
};

export default agent;
