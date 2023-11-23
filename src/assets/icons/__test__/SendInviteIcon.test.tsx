import { create } from "react-test-renderer";

import { SendInviteIcon } from "../SendInviteIcon";

describe("icon/SendInviteIcon", () => {
  it("renders a SendInviteIcon", () => {
    const result = create(<SendInviteIcon />);

    expect(result).toMatchSnapshot();
  });
});
