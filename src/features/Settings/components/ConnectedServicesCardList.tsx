import React from "react";
import { FlatList, ViewStyle } from "react-native";

import { Stack } from "@/components";
import { useThemeStyles } from "@/theme";

import { ConnectedServicesInterface } from "../types";
import ConnectedServicesCard from "./ConnectedServicesCard";

interface ConnectedServicesCardListProps {
  connectedAccounts: ConnectedServicesInterface[];
}

export default function ConnectedServicesCardList({ connectedAccounts }: ConnectedServicesCardListProps) {
  const listContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
  }));

  return (
    <Stack direction="vertical" style={listContainerStyle} align="stretch">
      <FlatList
        data={connectedAccounts}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ConnectedServicesCard
            title={item.title}
            status={item.status}
            accountsCount={item.accountsCount}
            firstConnected={item.firstConnected}
            connectionExpiry={item.connectionExpiry}
            lastDataShared={item.lastDataShared}
            disconnectionDate={item.disconnectionDate}
            expiryDate={item.expiryDate}
            rejectionDate={item.rejectionDate}
          />
        )}
      />
    </Stack>
  );
}
