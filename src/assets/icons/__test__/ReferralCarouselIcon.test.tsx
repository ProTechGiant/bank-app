import { create } from "react-test-renderer";

import { ReferralCarouselIcon } from "../ReferralCarouselIcon";

describe("icon/ReferralCarouselIcon", () => {
  it("renders a ReferralCarouselIcon", () => {
    const result = create(<ReferralCarouselIcon />);

    expect(result).toMatchSnapshot();
  });
});
