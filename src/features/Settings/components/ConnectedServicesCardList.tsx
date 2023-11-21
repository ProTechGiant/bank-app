import React from "react";
import { FlatList, RefreshControl } from "react-native";

import { SectionListFooter, Stack } from "@/components";

import { ConnectedServicesDataListInterface } from "../types";
import ConnectedServicesCard from "./ConnectedServicesCard";
import ConnectedServicesNotFound from "./ConnectedServicesNotFound";

interface ConnectedServicesCardListProps {
  connectedAccounts: ConnectedServicesDataListInterface[];
  onEndReached: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  isFilterActive: boolean;
  notFoundMessage: string;
}

export default function ConnectedServicesCardList({
  connectedAccounts,
  onEndReached,
  isLoading,
  onRefresh,
  isFilterActive,
  notFoundMessage,
}: ConnectedServicesCardListProps) {
  const sectionFooter = () => (
    <SectionListFooter isFilterActive={isFilterActive} activeFilterHeight={0.55} height={0.4} />
  );

  return (
    <Stack direction="vertical" align="stretch">
      <FlatList
        data={connectedAccounts}
        ListEmptyComponent={<ConnectedServicesNotFound message={notFoundMessage} />}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ConnectedServicesCard
            consentId={item.ConsentId}
            tPPInfo={item.TPPInfo}
            status={item.ConsentStatus}
            accountsNumber={item.AccountsNumber}
            creationDateTime={item.CreationDateTime}
            expirationDateTime={item.ExpirationDateTime}
            lastDataSharedDateTime={item.LastDataSharedDateTime}
          />
        )}
        ListFooterComponent={sectionFooter}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
        onEndReachedThreshold={0.1}
        onEndReached={({ distanceFromEnd }) => (distanceFromEnd >= 0.1 ? onEndReached() : undefined)}
        keyExtractor={() => Math.random().toString()}
      />
    </Stack>
  );
}
