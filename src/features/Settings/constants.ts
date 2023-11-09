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

export const ConnectedServicesCurrentFilterOptions = {
  "1month": "1",
  "3months": "3",
  "6months": "6",
  "12months": "12",
  moreThanYear: "more",
};

export const ConnectedServicesHistoryFilterOptions = {
  revoked: "Revoked",
  expired: "Expired",
  rejected: "Rejected",
};
