import { ConnectedServicesDataListInterface } from "../types";

export const sortNewestToOldest = (connectedServices: ConnectedServicesDataListInterface[]) => {
  return connectedServices.sort(
    (a, b) => new Date(b.CreationDateTime).getTime() - new Date(a.CreationDateTime).getTime()
  );
};
