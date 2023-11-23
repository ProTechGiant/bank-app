import { create } from "react-test-renderer";

import { CardMemberShipIcon } from "../CardMemberShipIcon";

describe("icon/CardMemberShipIcon", () => {
  it("renders a CardMemberShipIcon", () => {
    const result = create(<CardMemberShipIcon />);

    expect(result).toMatchSnapshot();
  });
});
