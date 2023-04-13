import React from "react";

import ContentContainer from "@/components/ContentContainer";
import Page from "@/components/Page";
import Typography from "@/components/Typography";

export default function AddNoteScreen() {
  return (
    <Page backgroundColor="neutralBase-60">
      <ContentContainer isScrollView>
        <Typography.Text>Transfer Success</Typography.Text>
      </ContentContainer>
    </Page>
  );
}
