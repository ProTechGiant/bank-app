import { create } from "react-test-renderer";

import { ReferralsIcon } from "../ReferralsIcon";

describe("icon/ReferralsIcon", () => {
  it("renders a ReferralsIcon", () => {
    const result = create(<ReferralsIcon />);

    expect(result).toMatchSnapshot();
  });
});
