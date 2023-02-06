import Stack from "@/components/Stack";

import Term from "./Term";

const Terms = () => (
  <Stack direction="vertical" gap="32p" align="stretch">
    <Term
      title="Summary heading 1"
      desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ante dui, convallis nec consequat
                      congue, ultricies sit amet mauris. Nullam aliquam neque in quam condimentum ornare. Sed ac
                      dignissim lorem. Morbi quis ipsum erat."
    />
    <Term
      title="Summary heading 2"
      desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ante dui, convallis nec consequat
                      congue, ultricies sit amet mauris. Nullam aliquam neque in quam condimentum ornare. Sed ac
                      dignissim lorem. Morbi quis ipsum erat."
    />
    <Term
      title="Summary heading 3"
      desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ante dui, convallis nec consequat
                      congue, ultricies sit amet mauris. Nullam aliquam neque in quam condimentum ornare. Sed ac
                      dignissim lorem. Morbi quis ipsum erat."
    />
  </Stack>
);

export default Terms;
