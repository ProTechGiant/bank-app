import { create } from "react-test-renderer";

import { InviteIcon } from "../InviteIcon";

describe("icon/InviteIcon", () => {
  it("renders a InviteIcon", () => {
    const result = create(<InviteIcon />);

    expect(result).toMatchSnapshot();
  });
});
