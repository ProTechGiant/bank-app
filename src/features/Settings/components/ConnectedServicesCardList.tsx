import React from "react";
import { FlatList, ViewStyle } from "react-native";

import { Stack } from "@/components";
import { useThemeStyles } from "@/theme";

import { ConnectedServicesDataListInterface } from "../types";
import ConnectedServicesCard from "./ConnectedServicesCard";
import ConnectedServicesNotFound from "./ConnectedServicesNotFound";

interface ConnectedServicesCardListProps {
  connectedAccounts: ConnectedServicesDataListInterface[];
}

export default function ConnectedServicesCardList({ connectedAccounts }: ConnectedServicesCardListProps) {
  const listContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
  }));

  return (
    <Stack direction="vertical" style={listContainerStyle} align="stretch">
      <FlatList
        data={connectedAccounts}
        ListEmptyComponent={<ConnectedServicesNotFound />}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ConnectedServicesCard
            tPPInfo={item.TPPInfo}
            status={item.ConsentStatus}
            accountsNumber={item.AccountsNumber}
            creationDateTime={item.CreationDateTime}
            expirationDateTime={item.ExpirationDateTime}
            lastDataSharedDateTime={item.LastDataSharedDateTime}
          />
        )}
      />
    </Stack>
  );
}
