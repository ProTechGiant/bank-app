import { create } from "react-test-renderer";

import { ReferralIcon } from "../ReferralIcon";

describe("icon/ReferralIcon", () => {
  it("renders a ReferralIcon", () => {
    const result = create(<ReferralIcon />);

    expect(result).toMatchSnapshot();
  });
});
