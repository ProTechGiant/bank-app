import { create } from "react-test-renderer";

import { CardIcon } from "../CardIcon";

describe("icon/CardIcon", () => {
  it("renders a CardIcon", () => {
    const result = create(<CardIcon />);

    expect(result).toMatchSnapshot();
  });
});
