import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Stack, Typography } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";

import { FilterTopBar, OrderItem } from "../components";
import { mockOrderList } from "../mocks/mockOrderList";

export default function ViewOrderScreen() {
  const { t } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  const handleOnFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  return (
    <Page backgroundColor="neutralBase-60" insets={["bottom"]} testID="MutualFund.ViewOrderScreen:Page">
      <NavHeader
        variant="white"
        title={t("MutualFund.ViewOrdersScreen.title")}
        testID="MutualFund.ViewOrdersScreen:NavHeader"
        withBackButton={true}
      />
      <FilterTopBar selectedFilter={selectedFilter} onFilterChange={handleOnFilterChange} />
      <ContentContainer>
        <Typography.Text size="footnote" weight="regular">
          {t("MutualFund.ViewOrdersScreen.orders")}
        </Typography.Text>
        <Stack direction="vertical" gap="16p">
          <OrderItem name={mockOrderList.Name} status={mockOrderList.Status} />
        </Stack>
      </ContentContainer>
    </Page>
  );
}
