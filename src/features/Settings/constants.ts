export enum ConnectedServicesStatus {
  AUTHORIZED = "Authorized",
  REVOKED = "Revoked",
  EXPIRED = "Expired",
  REJECTED = "Rejected",
}

export enum ConnectedServicesTabTypes {
  CURRENT = "Current",
  HISTORY = "History",
}

export const ConnectedServicesCurrentFilterOptions = ["1", "3", "6", "12", "more"];

export const ConnectedServicesHistoryFilterOptions = ["Revoked", "Expired", "Rejected"];

export const DefaultPageSize = 10;
export const DefaultPageNumber = 0;

export const currentTabDefaultUserConsentApiParams = {
  PageSize: DefaultPageSize,
  PageNumber: DefaultPageNumber,
  Status: [ConnectedServicesStatus.AUTHORIZED],
};

export const historyTabDefaultUserConsentApiParams = {
  PageSize: DefaultPageSize,
  PageNumber: DefaultPageNumber,
  Status: [ConnectedServicesStatus.EXPIRED, ConnectedServicesStatus.REJECTED, ConnectedServicesStatus.REVOKED],
};
