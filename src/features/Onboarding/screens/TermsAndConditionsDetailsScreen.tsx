import React from "react";
import { ScrollView, ViewStyle } from "react-native";

import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { useGetCustomerTermsAndConditions } from "../hooks/query-hooks";
import { TermsSection } from "../types";

export default function TermsAndConditionsDetailsScreen() {
  const { data } = useGetCustomerTermsAndConditions();

  const containerStyles = useThemeStyles<ViewStyle>(theme => ({
    marginLeft: theme.spacing["32p"],
    marginRight: theme.spacing["32p"],
    marginVertical: theme.spacing["12p"],
  }));

  const titleStyles = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["20p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader withBackButton={true} testID="Onboarding.TermsAndConditionsDetailScreen:NavHeader" />
      <ScrollView>
        <Stack direction="vertical" style={containerStyles}>
          {data?.TermsSections.map((section: TermsSection) => (
            <Stack key={section.TermsSectionId} direction="vertical">
              <Typography.Text weight="bold" size="footnote" color="primaryBase" style={titleStyles}>
                {section.Title}
              </Typography.Text>
              {section.Bodies.map(body => (
                <Stack key={body.TermsBodyId} direction="vertical">
                  <Typography.Text align="justify" size="footnote" color="neutralBase+10">
                    {body.Body}
                  </Typography.Text>
                </Stack>
              ))}
            </Stack>
          ))}
        </Stack>
      </ScrollView>
    </Page>
  );
}
